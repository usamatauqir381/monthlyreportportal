import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, getUserRole, getUserTenant } from "@/lib/auth";

/**
 * GET /api/v1/submissions
 * Fetch submissions for authenticated user's department or all (if CEO)
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
    const monthDate = month ? new Date(month) : new Date();

    let whereClause: any = {
      tenantId,
      month: {
        gte: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
        lte: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
      },
    };

    // Non-CEO users can only see their department
    if (userRole !== "CEO" && userRole !== "ADMIN") {
      whereClause.departmentId = userDepartmentId;
    }

    const submissions = await prisma.monthlySubmission.findMany({
      where: whereClause,
      include: {
        department: true,
        user: true,
        approvals: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { month: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("[API] GET /submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/submissions
 * Create or update a monthly submission
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { departmentId, month, data, notes } = body;

    if (!departmentId || !month || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tenantId = session.user?.user_metadata?.tenant_id;
    const userRole = session.user?.user_metadata?.role;
    const userDepartmentId = session.user?.user_metadata?.department_id;

    // Check authorization
    if (
      userRole !== "CEO" &&
      userRole !== "ADMIN" &&
      userDepartmentId !== departmentId
    ) {
      return NextResponse.json(
        { error: "Not authorized to submit for this department" },
        { status: 403 }
      );
    }

    const monthDate = new Date(month);
    monthDate.setDate(1);

    // Find or create submission
    let submission = await prisma.monthlySubmission.findUnique({
      where: {
        tenantId_departmentId_month: {
          tenantId,
          departmentId,
          month: monthDate,
        },
      },
    });

    if (submission) {
      // Update existing
      submission = await prisma.monthlySubmission.update({
        where: { id: submission.id },
        data: {
          data,
          notes,
          updatedAt: new Date(),
        },
        include: {
          department: true,
          approvals: {
            include: {
              user: true,
            },
          },
        },
      });
    } else {
      // Create new
      submission = await prisma.monthlySubmission.create({
        data: {
          tenantId,
          departmentId,
          month: monthDate,
          data,
          notes,
          submittedBy: session.user?.id,
          status: "DRAFT",
        },
        include: {
          department: true,
          approvals: true,
        },
      });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("[API] POST /submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
