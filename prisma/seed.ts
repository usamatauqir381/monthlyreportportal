// prisma/seed.ts
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Use your runtime connection string (Transaction Pooler 6543)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("Starting database seed...");

  // 1) Tenant (idempotent)
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "smartpath" },
    update: {},
    create: { name: "Smart Path Academy", subdomain: "smartpath" },
  });

  // 2) Departments (idempotent) — @@unique([tenantId, slug])
  const deptSpecs = [
    { name: "Support Team",            slug: "support" },
    { name: "Sales & Marketing",       slug: "sales" },
    { name: "HR & Recruitment",        slug: "hr" },
    { name: "Finance & Admin",         slug: "finance" },
    { name: "Training & Development",  slug: "td" },
  ];

  const departments = await Promise.all(
    deptSpecs.map((d) =>
      prisma.department.upsert({
        where: { tenantId_slug: { tenantId: tenant.id, slug: d.slug } },
        update: { name: d.name },
        create: { name: d.name, slug: d.slug, tenantId: tenant.id },
      })
    )
  );

  // 3) Password
  const hashedPassword = await bcrypt.hash("demo123", 10);

  // 4) CEO (idempotent)
  const ceoUser = await prisma.user.upsert({
    where: { email: "ceo@smartpath.com" },
    update: {},
    create: {
      email: "ceo@smartpath.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "CEO",
      role: "CEO",
      tenantId: tenant.id,
    },
  });

  // 5) Department heads (idempotent)
  const headSpecs = [
    { email: "support@smartpath.com",  firstName: "Sarah",  lastName: "Support",  deptIndex: 0 },
    { email: "sales@smartpath.com",    firstName: "Mike",   lastName: "Sales",    deptIndex: 1 },
    { email: "hr@smartpath.com",       firstName: "Lisa",   lastName: "HR",       deptIndex: 2 },
    { email: "finance@smartpath.com",  firstName: "David",  lastName: "Finance",  deptIndex: 3 },
    { email: "training@smartpath.com", firstName: "Emily",  lastName: "Training", deptIndex: 4 },
  ];

  const departmentHeads = await Promise.all(
    headSpecs.map((h) =>
      prisma.user.upsert({
        where: { email: h.email },
        update: {},
        create: {
          email: h.email,
          password: hashedPassword,
          firstName: h.firstName,
          lastName: h.lastName,
          role: "DEPARTMENT_HEAD",
          tenantId: tenant.id,
          departmentId: departments[h.deptIndex].id, // required string
        },
      })
    )
  );

  // 6) Set headId on each department (required string)
  await Promise.all(
    departments.map((dept, i) =>
      prisma.department.update({
        where: { id: dept.id },
        data: { headId: departmentHeads[i].id },
      })
    )
  );

  // 7) Metrics (idempotent) — @@unique([tenantId, key, month, departmentId])
  const month = new Date();
  month.setUTCDate(1); month.setUTCHours(0, 0, 0, 0);

  const metricsData = [
    { key: "active_students",        value: 1250,   unit: "count",  deptIndex: null },
    { key: "net_growth_mth",         value: 8.5,    unit: "%",      deptIndex: null },
    { key: "churn_rate",             value: 2.3,    unit: "%",      deptIndex: null },
    { key: "arpa",                   value: 4500,   unit: "$",      deptIndex: null },
    { key: "revenue_mtd",            value: 562500, unit: "$",      deptIndex: null },
    { key: "cash_collected",         value: 520000, unit: "$",      deptIndex: null },
    { key: "outstanding_receivables",value: 42500,  unit: "$",      deptIndex: null },
    { key: "gross_margin_pct",       value: 68.5,   unit: "%",      deptIndex: null },
    { key: "tutor_utilization_pct",  value: 82.3,   unit: "%",      deptIndex: null },
    { key: "cac",                    value: 320,    unit: "$",      deptIndex: null },
    { key: "payback_months",         value: 4.2,    unit: "months", deptIndex: null },
    { key: "escalation_count",       value: 12,     unit: "count",  deptIndex: null },
    { key: "compliance_breaches",    value: 0,      unit: "count",  deptIndex: null },
    { key: "quality_flags",          value: 3,      unit: "count",  deptIndex: null },
    { key: "submission_count",       value: 5,      unit: "count",  deptIndex: null },
  ];

  await Promise.all(
    metricsData.map((m) => {
      const deptId: string | null = m.deptIndex == null ? null : departments[m.deptIndex].id; // <- nullable OK for Metric
      return prisma.metric.upsert({
        where: {
          tenantId_key_month_departmentId: {
            tenantId: tenant.id,
            key: m.key,
            month,
            departmentId: deptId ?? "", // Use empty string as fallback for null
          },
        },
        update: { value: m.value, unit: m.unit ?? null },
        create: {
          tenantId: tenant.id,
          key: m.key,
          value: m.value,
          unit: m.unit ?? null,
          month,
          departmentId: deptId,
        },
      });
    })
  );

  // 8) Monthly submissions (idempotent) — @@unique([tenantId, departmentId, month])
const submissionSpecs = [
  {
    deptIndex: 0,
    status: "APPROVED" as const,
    data: { openTickets: 24, avgResolutionTime: 4.5, csatScore: 4.2, responseRate: 95, escalationRate: 8 },
    submittedByIndex: 0,
  },
  {
    deptIndex: 1,
    status: "SUBMITTED" as const,
    data: { leadsGenerated: 145, conversionRate: 12.4, dealsClosed: 18, pipelineValue: 425000 },
    submittedByIndex: 1,
  },
  {
    deptIndex: 2,
    status: "DRAFT" as const,
    data: { openPositions: 7, applicationsReceived: 156, interviewsScheduled: 28, offersExtended: 5 },
    submittedByIndex: 2,
  },
];

await Promise.all(
  submissionSpecs.map((s) => {
    // ✅ Ensure departmentId is a definite string (not nullable)
    const dept = departments[s.deptIndex];
    if (!dept) throw new Error(`Invalid dept index ${s.deptIndex}`);
    const departmentId: string = dept.id;

    // `submittedBy` is String? in schema → string or null are both valid.
    const submittedBy: string | null = departmentHeads[s.submittedByIndex]?.id ?? null;

    return prisma.monthlySubmission.upsert({
      where: {
        tenantId_departmentId_month: {
          tenantId: tenant.id,
          departmentId, // required string
          month,
        },
      },
      update: {
        status: s.status,
        data: s.data as any,
        submittedBy, // String? → string | null allowed
      },
      create: {
        tenantId: tenant.id,
        departmentId, // required string
        month,
        status: s.status,
        data: s.data as any,
        submittedBy, // String?
      },
    });
  })
);

  console.log("Database seed completed successfully!");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });