import { prisma } from "./db";

export interface MetricData {
  key: string;
  label: string;
  value: number;
  unit: string;
  trend?: number; // percentage change from previous month
  status?: "green" | "yellow" | "red"; // for risk indicators
  category: "students" | "revenue" | "operations" | "risk";
}

/**
 * Calculate all 15 CEO dashboard metrics
 */
export async function calculateCEOMetrics(
  tenantId: string,
  month: Date
): Promise<MetricData[]> {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // Get current month metrics
  const currentMetrics = await prisma.metric.findMany({
    where: {
      tenantId,
      month: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  // Get previous month metrics for trend calculation
  const prevMonth = new Date(month);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  const prevStartOfMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth(),
    1
  );
  const prevEndOfMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  );

  const previousMetrics = await prisma.metric.findMany({
    where: {
      tenantId,
      month: {
        gte: prevStartOfMonth,
        lte: prevEndOfMonth,
      },
    },
  });

  // Helper to find metric value
  const getMetricValue = (key: string, metrics: any[]) => {
    const metric = metrics.find((m) => m.key === key);
    return metric?.value ?? 0;
  };

  // Helper to calculate trend
  const calculateTrend = (currentVal: number, prevVal: number) => {
    if (prevVal === 0) return 0;
    return ((currentVal - prevVal) / prevVal) * 100;
  };

  // Helper to get status color
  const getStatusColor = (value: number, threshold: number) => {
    return value <= threshold ? "green" : value <= threshold * 1.5 ? "yellow" : "red";
  };

  const metrics: MetricData[] = [
    // STUDENT METRICS
    {
      key: "active_students",
      label: "Active Students",
      value: getMetricValue("active_students", currentMetrics),
      unit: "count",
      trend: calculateTrend(
        getMetricValue("active_students", currentMetrics),
        getMetricValue("active_students", previousMetrics)
      ),
      category: "students",
    },
    {
      key: "net_growth_mth",
      label: "Net Growth (MoM)",
      value: getMetricValue("net_growth_mth", currentMetrics),
      unit: "%",
      category: "students",
    },
    {
      key: "churn_rate",
      label: "Churn Rate",
      value: getMetricValue("churn_rate", currentMetrics),
      unit: "%",
      status: getStatusColor(getMetricValue("churn_rate", currentMetrics), 2),
      category: "students",
    },

    // REVENUE METRICS
    {
      key: "arpa",
      label: "ARPA (Avg Revenue Per Account)",
      value: getMetricValue("arpa", currentMetrics),
      unit: "$",
      trend: calculateTrend(
        getMetricValue("arpa", currentMetrics),
        getMetricValue("arpa", previousMetrics)
      ),
      category: "revenue",
    },
    {
      key: "revenue_mtd",
      label: "Revenue (MTD)",
      value: getMetricValue("revenue_mtd", currentMetrics),
      unit: "$",
      category: "revenue",
    },
    {
      key: "cash_collected",
      label: "Cash Collected",
      value: getMetricValue("cash_collected", currentMetrics),
      unit: "$",
      category: "revenue",
    },
    {
      key: "outstanding_receivables",
      label: "Outstanding Receivables",
      value: getMetricValue("outstanding_receivables", currentMetrics),
      unit: "$",
      status: getStatusColor(
        getMetricValue("outstanding_receivables", currentMetrics),
        50000
      ),
      category: "revenue",
    },
    {
      key: "gross_margin_pct",
      label: "Gross Margin",
      value: getMetricValue("gross_margin_pct", currentMetrics),
      unit: "%",
      category: "revenue",
    },

    // OPERATIONAL METRICS
    {
      key: "tutor_utilization_pct",
      label: "Tutor Utilization",
      value: getMetricValue("tutor_utilization_pct", currentMetrics),
      unit: "%",
      category: "operations",
    },
    {
      key: "cac",
      label: "CAC (Customer Acquisition Cost)",
      value: getMetricValue("cac", currentMetrics),
      unit: "$",
      category: "operations",
    },
    {
      key: "payback_months",
      label: "Payback Period",
      value: getMetricValue("payback_months", currentMetrics),
      unit: "months",
      status: getStatusColor(
        getMetricValue("payback_months", currentMetrics),
        5
      ),
      category: "operations",
    },

    // RISK INDICATORS
    {
      key: "escalation_count",
      label: "Open Escalations",
      value: getMetricValue("escalation_count", currentMetrics),
      unit: "count",
      status: getStatusColor(getMetricValue("escalation_count", currentMetrics), 10),
      category: "risk",
    },
    {
      key: "compliance_breaches",
      label: "Compliance Breaches",
      value: getMetricValue("compliance_breaches", currentMetrics),
      unit: "count",
      status: getMetricValue("compliance_breaches", currentMetrics) > 0 ? "red" : "green",
      category: "risk",
    },
    {
      key: "quality_flags",
      label: "Quality Flags",
      value: getMetricValue("quality_flags", currentMetrics),
      unit: "count",
      status: getStatusColor(getMetricValue("quality_flags", currentMetrics), 5),
      category: "risk",
    },
  ];

  return metrics;
}

/**
 * Get all metrics grouped by category
 */
export function groupMetricsByCategory(metrics: MetricData[]) {
  return {
    students: metrics.filter((m) => m.category === "students"),
    revenue: metrics.filter((m) => m.category === "revenue"),
    operations: metrics.filter((m) => m.category === "operations"),
    risk: metrics.filter((m) => m.category === "risk"),
  };
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: number, unit: string): string {
  switch (unit) {
    case "$":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: value > 999999 ? "compact" : "standard",
      }).format(value);
    case "%":
      return `${value.toFixed(1)}%`;
    case "count":
      return value.toString();
    case "months":
      return `${value.toFixed(1)} mo`;
    default:
      return value.toString();
  }
}
