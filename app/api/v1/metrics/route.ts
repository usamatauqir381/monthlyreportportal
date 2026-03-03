import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET /api/v1/metrics
 * Fetch metrics for authenticated user's scope
 * Query params:
 *   - month: ISO date for the month
 *   - departmentId: (optional) filter by department
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user?.user_metadata?.role;
    const userDepartmentId = session.user?.user_metadata?.department_id;
    const tenantId = session.user?.user_metadata?.tenant_id;

    if (!tenantId) {
      return NextResponse.json(
        { error: "No tenant associated with user" },
        { status: 400 }
      );
    }

    const month = request.nextUrl.searchParams.get("month");
    const departmentId = request.nextUrl.searchParams.get("departmentId");
    const monthDate = month ? new Date(month) : new Date();

    const startOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    );

    let whereClause: any = {
      tenantId,
      month: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    };

    // Filter by department if specified
    if (departmentId) {
      whereClause.departmentId = departmentId;
    } else if (userRole !== "CEO" && userRole !== "ADMIN") {
      // Non-CEO users can only see their department metrics
      whereClause.departmentId = userDepartmentId;
    }

    const metrics = await prisma.metric.findMany({
      where: whereClause,
      include: {
        department: true,
      },
      orderBy: [{ key: "asc" }, { recordedAt: "desc" }],
    });

    return NextResponse.json({
      metrics,
      month: monthDate,
      tenant_id: tenantId,
    });
  } catch (error) {
    console.error("[API] GET /metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/metrics
 * Record metrics (usually called after submission changes)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user?.user_metadata?.role;
    const tenantId = session.user?.user_metadata?.tenant_id;

    // Only admin and CEO can create metrics
    if (userRole !== "ADMIN" && userRole !== "CEO") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { key, value, unit, month, departmentId } = body;

    if (!key || value === undefined || !month) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const monthDate = new Date(month);
    monthDate.setDate(1);

    const metric = await prisma.metric.upsert({
      where: {
        tenantId_key_month_departmentId: {
          tenantId,
          key,
          month: monthDate,
          departmentId: departmentId || null,
        },
      },
      create: {
        tenantId,
        key,
        value,
        unit,
        month: monthDate,
        departmentId,
      },
      update: {
        value,
        unit,
        recordedAt: new Date(),
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error("[API] POST /metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
