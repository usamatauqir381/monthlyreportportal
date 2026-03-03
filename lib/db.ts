// lib/db.ts
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Try to load CA from env (base64) or from repo file path.
 * This avoids crashing in dev and supports serverless hosts like Vercel.
 */
function loadCA(): string | undefined {
  // 1) Prefer env var (recommended for deployments)
  const b64 = process.env.DB_CA_B64;
  if (b64 && b64.trim()) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      if (decoded.trim()) return decoded;
    } catch {
      // ignore and fallback to file
    }
  }

  // 2) Fallback to file path (repo-committed or mounted file)
  const filePath = path.resolve(process.cwd(), "certs", "prod-ca-2021.crt");
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8");
    }
  } catch {
    // ignore—no CA
  }

  return undefined;
}

const isProd = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. For Supabase, use the Runtime/Transaction Pooler (port 6543) and include sslmode=require."
  );
}

// log for debugging (redact password)
try {
  const url = new URL(connectionString);
  url.password = '***';
  console.log('[db] using DATABASE_URL', url.toString());
} catch (e) {
  console.log('[db] invalid DATABASE_URL', connectionString);
}

const ca = loadCA();

/**
 * SSL policy:
 * - Production:
 *   - If CA present → verify (rejectUnauthorized: true)
 *   - If no CA → still use SSL, but verification is disabled (rejectUnauthorized: false)
 *     (Optionally, you can throw here to enforce CA presence in prod.)
 * - Development:
 *   - If CA present → use it with relaxed verification (rejectUnauthorized: false)
 *   - If no CA → disable SSL (common for local Postgres). Change to `false` or to `{ rejectUnauthorized: false }`
 *     depending on your local DB.
 */
const ssl =
  isProd
    ? (ca
        ? { ca, rejectUnauthorized: true }
        : { rejectUnauthorized: false })
    : (ca
        ? { ca, rejectUnauthorized: false }
        // In development we still need to talk TLS to Supabase/pgbouncer, but
        // the certificate is self‑signed.  Rather than turning ssl completely
        // off (which the pooler may reject), just disable verification so the
        // handshake succeeds.  You can also set DB_CA_B64 or commit a CA file
        // and the code above will pick it up instead.
        : { rejectUnauthorized: false });

const pool = new Pool({
  connectionString,
  ssl,
});

const adapter = new PrismaPg(pool);

// Keep a single PrismaClient instance across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

/**
 * Get the current user from session and their DB record (omit password)
 */
export async function getCurrentUser(session: any) {
  const email: string | undefined =
    typeof session?.user?.email === "string" ? session.user.email.toLowerCase() : undefined;
  if (!email) return null;

  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
      avatar: true,
      tenantId: true,
      departmentId: true,
      tenant: true,
      department: true,
    },
  });
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string | null | undefined, requiredRoles: string[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

/**
 * Get all metrics for a department in a given month (UTC-safe boundaries)
 */
export async function getDepartmentMetrics(departmentId: string, month: Date) {
  const start = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  return prisma.metric.findMany({
    where: { departmentId, month: { gte: start, lte: end } },
  });
}

/**
 * Get tenant-wide metrics (for CEO dashboard)
 */
export async function getTenantMetrics(tenantId: string, month: Date) {
  const start = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  return prisma.metric.findMany({
    where: { tenantId, month: { gte: start, lte: end } },
    include: { department: true },
  });
}

/**
 * Get monthly submissions for a department
 */
export async function getDepartmentSubmissions(departmentId: string, tenantId: string, limit?: number) {
  return prisma.monthlySubmission.findMany({
    where: { departmentId, tenantId },
    include: {
      user: true,
      approvals: { include: { user: true } },
    },
    orderBy: { month: "desc" },
    take: limit,
  });
}

/**
 * Get all departments for a tenant
 */
export async function getTenantDepartments(tenantId: string) {
  return prisma.department.findMany({
    where: { tenantId },
    include: { head: true, users: true },
  });
}

/**
 * Calculate CEO dashboard metrics from raw metric data
 */
export async function calculateCEODashboardMetrics(tenantId: string, month: Date) {
  const metrics = await getTenantMetrics(tenantId, month);
  const submissions = await prisma.monthlySubmission.findMany({
    where: { tenantId, month },
    include: { department: true },
  });

  const aggregated: Record<
    string,
    { total: number; count: number; values: { departmentId: string | null; value: number; unit: string | null }[] }
  > = {};

  for (const metric of metrics) {
    if (!aggregated[metric.key]) {
      aggregated[metric.key] = { total: 0, count: 0, values: [] };
    }
    aggregated[metric.key].total += metric.value;
    aggregated[metric.key].count += 1;
    aggregated[metric.key].values.push({
      departmentId: metric.departmentId ?? null,
      value: metric.value,
      unit: metric.unit ?? null,
    });
  }

  const dashboardMetrics = Object.entries(aggregated).map(([key, data]) => ({
    key,
    value: data.count ? data.total / data.count : 0,
    unit: data.values[0]?.unit ?? null,
    breakdown: data.values,
  }));

  return {
    metrics: dashboardMetrics,
    submissionCount: submissions.length,
    pendingApprovals: submissions.filter((s) => s.status === "UNDER_REVIEW").length,
  };
}
