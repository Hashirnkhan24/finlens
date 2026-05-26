import type { BudgetVariance, DemoWorkspace, Financials, InsightBlueprint, Metric, MetricGroup, Scenario } from "./types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2
});

export function formatInr(value: number) {
  if (Math.abs(value) >= 10_000_000) {
    return `₹${number.format(value / 10_000_000)} Cr`;
  }

  if (Math.abs(value) >= 100_000) {
    return `₹${number.format(value / 100_000)} L`;
  }

  return currency.format(value);
}

function ratioStatus(value: number, greenMin: number, amberMin: number): Metric["status"] {
  if (value >= greenMin) return "green";
  if (value >= amberMin) return "amber";
  return "red";
}

function percentStatus(value: number, greenMin: number, amberMin: number): Metric["status"] {
  if (value >= greenMin) return "green";
  if (value >= amberMin) return "amber";
  return "red";
}

export function computeMetrics(financials: Financials): Metric[] {
  const grossMargin = (financials.revenue - financials.cogs) / financials.revenue;
  const ebitdaMargin = financials.ebitda / financials.revenue;
  const netMargin = financials.netProfit / financials.revenue;
  const currentRatio = financials.currentAssets / financials.currentLiabilities;
  const quickRatio = (financials.currentAssets - financials.inventory) / financials.currentLiabilities;
  const debtToEquity = financials.totalDebt / financials.equity;
  const operatingCashFlowRatio = financials.operatingCashFlow / financials.currentLiabilities;
  const revenueGrowth = (financials.revenue - financials.previousRevenue) / financials.previousRevenue;
  const dso = (financials.accountsReceivable / financials.revenue) * 365;
  const dpo = (financials.accountsPayable / Math.max(financials.cogs, 1)) * 365;
  const dio = financials.inventory > 0 ? (financials.inventory / Math.max(financials.cogs, 1)) * 365 : 0;
  const cashConversionCycle = dso + dio - dpo;
  const cashRatio = financials.cash / financials.currentLiabilities;
  const inventoryTurnover = financials.inventory > 0 ? financials.cogs / financials.inventory : 0;
  const assetTurnover = financials.revenue / financials.totalAssets;
  const receivableTurnover = financials.revenue / Math.max(financials.accountsReceivable, 1);
  const burnRate = financials.operatingCashFlow < 0 ? Math.abs(financials.operatingCashFlow) / 3 : 0;
  const cashRunway = burnRate > 0 ? financials.cash / burnRate : 24;
  const interestCoverage = financials.ebitda / Math.max(financials.totalDebt * 0.025, 1);
  const dscr = financials.operatingCashFlow / Math.max(financials.totalDebt * 0.08, 1);
  const expenseGrowth = financials.operatingExpenses / Math.max(financials.previousRevenue, 1) - 0.22;

  return [
    {
      id: "gross-margin",
      name: "Gross Margin",
      rawValue: grossMargin,
      value: `${number.format(grossMargin * 100)}%`,
      status: percentStatus(grossMargin, 0.35, 0.22),
      formula: "(Revenue - COGS) / Revenue",
      interpretation: "Core production or delivery efficiency after direct costs.",
      lineageRefs: ["pl-revenue", "pl-cogs"]
    },
    {
      id: "ebitda-margin",
      name: "EBITDA Margin",
      rawValue: ebitdaMargin,
      value: `${number.format(ebitdaMargin * 100)}%`,
      status: percentStatus(ebitdaMargin, 0.18, 0.12),
      formula: "EBITDA / Revenue",
      interpretation: "Operating profitability before capital structure and tax effects.",
      lineageRefs: ["pl-ebitda", "pl-revenue"]
    },
    {
      id: "net-margin",
      name: "Net Profit Margin",
      rawValue: netMargin,
      value: `${number.format(netMargin * 100)}%`,
      status: percentStatus(netMargin, 0.1, 0.04),
      formula: "Net Profit / Revenue",
      interpretation: "Bottom-line profitability after all expenses.",
      lineageRefs: ["pl-net-profit", "pl-revenue"]
    },
    {
      id: "current-ratio",
      name: "Current Ratio",
      rawValue: currentRatio,
      value: number.format(currentRatio),
      status: ratioStatus(currentRatio, 1.5, 1),
      formula: "Current Assets / Current Liabilities",
      interpretation: "Short-term liquidity and ability to meet near-term obligations.",
      lineageRefs: ["bs-current-assets", "bs-current-liabilities"]
    },
    {
      id: "quick-ratio",
      name: "Quick Ratio",
      rawValue: quickRatio,
      value: number.format(quickRatio),
      status: ratioStatus(quickRatio, 1, 0.75),
      formula: "(Current Assets - Inventory) / Current Liabilities",
      interpretation: "Liquidity excluding slower-moving inventory.",
      lineageRefs: ["bs-current-assets", "bs-inventory", "bs-current-liabilities"]
    },
    {
      id: "debt-equity",
      name: "Debt to Equity",
      rawValue: debtToEquity,
      value: number.format(debtToEquity),
      status: debtToEquity <= 1 ? "green" : debtToEquity <= 2 ? "amber" : "red",
      formula: "Total Debt / Shareholders' Equity",
      interpretation: "Capital structure risk and reliance on debt financing.",
      lineageRefs: ["bs-total-debt", "bs-equity"]
    },
    {
      id: "ocf-ratio",
      name: "Operating Cash Flow Ratio",
      rawValue: operatingCashFlowRatio,
      value: number.format(operatingCashFlowRatio),
      status: ratioStatus(operatingCashFlowRatio, 0.7, 0.4),
      formula: "Operating Cash Flow / Current Liabilities",
      interpretation: "Ability to cover current liabilities from operations.",
      lineageRefs: ["cf-operating-cash-flow", "bs-current-liabilities"]
    },
    {
      id: "revenue-growth",
      name: "Revenue Growth",
      rawValue: revenueGrowth,
      value: `${number.format(revenueGrowth * 100)}%`,
      status: percentStatus(revenueGrowth, 0.12, 0.04),
      formula: "(Current Revenue - Previous Revenue) / Previous Revenue",
      interpretation: "Period-over-period top-line momentum.",
      lineageRefs: ["pl-revenue", "historical-revenue"]
    },
    {
      id: "dso",
      name: "Days Sales Outstanding",
      rawValue: dso,
      value: `${number.format(dso)} days`,
      status: dso <= 60 ? "green" : dso <= 90 ? "amber" : "red",
      formula: "Accounts Receivable / Revenue * 365",
      interpretation: "Average collection time. Above 90 days is a collection risk in this model.",
      lineageRefs: ["ar-ledger", "pl-revenue"]
    },
    {
      id: "dpo",
      name: "Days Payable Outstanding",
      rawValue: dpo,
      value: `${number.format(dpo)} days`,
      status: dpo >= 35 && dpo <= 90 ? "green" : dpo < 25 ? "amber" : "red",
      formula: "Accounts Payable / COGS * 365",
      interpretation: "Average supplier payment time and working-capital timing.",
      lineageRefs: ["ap-ledger", "pl-cogs"]
    },
    {
      id: "cash-ratio",
      name: "Cash Ratio",
      rawValue: cashRatio,
      value: number.format(cashRatio),
      status: ratioStatus(cashRatio, 0.35, 0.18),
      formula: "Cash / Current Liabilities",
      interpretation: "Immediate liquidity from cash alone.",
      lineageRefs: ["bs-cash", "bs-current-liabilities"]
    },
    {
      id: "dio",
      name: "Days Inventory Outstanding",
      rawValue: dio,
      value: financials.inventory > 0 ? `${number.format(dio)} days` : "N/A",
      status: financials.inventory === 0 ? "green" : dio <= 90 ? "green" : dio <= 140 ? "amber" : "red",
      formula: "Inventory / COGS * 365",
      interpretation: "Average days inventory remains before sale or consumption.",
      lineageRefs: ["bs-inventory", "inventory-ledger", "pl-cogs"]
    },
    {
      id: "ccc",
      name: "Cash Conversion Cycle",
      rawValue: cashConversionCycle,
      value: `${number.format(cashConversionCycle)} days`,
      status: cashConversionCycle <= 75 ? "green" : cashConversionCycle <= 120 ? "amber" : "red",
      formula: "DSO + DIO - DPO",
      interpretation: "Days cash is tied up across receivables, inventory, and payables.",
      lineageRefs: ["ar-ledger", "inventory-ledger", "ap-ledger"]
    },
    {
      id: "interest-coverage",
      name: "Interest Coverage",
      rawValue: interestCoverage,
      value: `${number.format(interestCoverage)}x`,
      status: ratioStatus(interestCoverage, 4, 2),
      formula: "EBITDA / Estimated Interest",
      interpretation: "Capacity to service interest obligations from operating earnings.",
      lineageRefs: ["pl-ebitda", "debt-schedule"]
    },
    {
      id: "dscr",
      name: "Debt Service Coverage",
      rawValue: dscr,
      value: `${number.format(dscr)}x`,
      status: ratioStatus(dscr, 1.4, 1),
      formula: "Operating Cash Flow / Estimated Debt Service",
      interpretation: "Ability to cover debt service from cash generated by operations.",
      lineageRefs: ["cf-operating-cash-flow", "debt-schedule"]
    },
    {
      id: "asset-turnover",
      name: "Asset Turnover",
      rawValue: assetTurnover,
      value: `${number.format(assetTurnover)}x`,
      status: ratioStatus(assetTurnover, 0.9, 0.55),
      formula: "Revenue / Total Assets",
      interpretation: "Efficiency of revenue generation from asset base.",
      lineageRefs: ["pl-revenue", "bs-total-assets"]
    },
    {
      id: "inventory-turnover",
      name: "Inventory Turnover",
      rawValue: inventoryTurnover,
      value: financials.inventory > 0 ? `${number.format(inventoryTurnover)}x` : "N/A",
      status: financials.inventory === 0 ? "green" : ratioStatus(inventoryTurnover, 4, 2.5),
      formula: "COGS / Inventory",
      interpretation: "How often inventory turns during the period.",
      lineageRefs: ["pl-cogs", "inventory-ledger"]
    },
    {
      id: "receivable-turnover",
      name: "Receivable Turnover",
      rawValue: receivableTurnover,
      value: `${number.format(receivableTurnover)}x`,
      status: ratioStatus(receivableTurnover, 6, 4),
      formula: "Revenue / Accounts Receivable",
      interpretation: "Collection efficiency relative to revenue.",
      lineageRefs: ["pl-revenue", "ar-ledger"]
    },
    {
      id: "burn-rate",
      name: "Burn Rate",
      rawValue: burnRate,
      value: burnRate > 0 ? `${formatInr(burnRate)} / mo` : "Positive OCF",
      status: burnRate === 0 ? "green" : burnRate <= financials.cash / 12 ? "amber" : "red",
      formula: "Negative Operating Cash Flow / 3",
      interpretation: "Monthly operating cash consumption based on the quarter.",
      lineageRefs: ["cf-operating-cash-flow", "bs-cash"]
    },
    {
      id: "cash-runway",
      name: "Cash Runway",
      rawValue: cashRunway,
      value: cashRunway >= 24 ? "24+ months" : `${number.format(cashRunway)} months`,
      status: cashRunway >= 12 ? "green" : cashRunway >= 6 ? "amber" : "red",
      formula: "Cash / Monthly Burn",
      interpretation: "Estimated months of runway at current operating cash burn.",
      lineageRefs: ["bs-cash", "cf-operating-cash-flow"]
    },
    {
      id: "expense-growth",
      name: "Expense Growth Proxy",
      rawValue: expenseGrowth,
      value: `${number.format(expenseGrowth * 100)}%`,
      status: expenseGrowth <= 0.04 ? "green" : expenseGrowth <= 0.12 ? "amber" : "red",
      formula: "Operating Expenses / Previous Revenue - baseline ratio",
      interpretation: "Simulated overrun proxy comparing expense intensity against prior revenue.",
      lineageRefs: ["pl-operating-expenses", "historical-revenue"]
    }
  ];
}

export function computeMetricGroups(financials: Financials): MetricGroup[] {
  const metrics = computeMetrics(financials);
  const byId = new Map(metrics.map((metric) => [metric.id, metric]));
  const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((metric): metric is Metric => Boolean(metric));

  return [
    { title: "Profitability", metrics: pick(["gross-margin", "ebitda-margin", "net-margin"]) },
    { title: "Liquidity", metrics: pick(["current-ratio", "quick-ratio", "cash-ratio", "ocf-ratio"]) },
    { title: "Working Capital", metrics: pick(["dso", "dpo", "dio", "ccc"]) },
    { title: "Solvency", metrics: pick(["debt-equity", "interest-coverage", "dscr"]) },
    { title: "Efficiency", metrics: pick(["asset-turnover", "inventory-turnover", "receivable-turnover"]) },
    { title: "Operational Health", metrics: pick(["revenue-growth", "expense-growth", "burn-rate", "cash-runway"]) }
  ];
}

export function computeFinanceHealth(metrics: Metric[]) {
  const score = metrics.reduce((total, metric) => total + (metric.status === "green" ? 5 : metric.status === "amber" ? 3 : 1), 0);
  return Math.round((score / (metrics.length * 5)) * 100);
}

export function buildScenarios(workspace: DemoWorkspace): Scenario[] {
  const revenueBase = workspace.financials.revenue;
  const monthlyBurn = workspace.financials.operatingCashFlow < 0 ? Math.abs(workspace.financials.operatingCashFlow) / 3 : 0;

  return [
    {
      id: "pricing",
      name: "Increase pricing by 5%",
      assumption: "No demand loss, gross margin flow-through at current direct-cost structure.",
      ebitdaImpact: revenueBase * 0.05 * 0.72,
      runwayImpactMonths: monthlyBurn > 0 ? (revenueBase * 0.05 * 0.72) / monthlyBurn : 0,
      marginImpact: 0.024
    },
    {
      id: "collections",
      name: "Reduce collection delay by 15 days",
      assumption: "Accelerates cash from receivables without changing recognized revenue.",
      ebitdaImpact: 0,
      runwayImpactMonths: monthlyBurn > 0 ? (workspace.financials.accountsReceivable * 0.18) / monthlyBurn : 0,
      marginImpact: 0
    },
    {
      id: "hiring",
      name: "Add 20 employees",
      assumption: "Average loaded monthly cost is simulated from current payroll intensity.",
      ebitdaImpact: -18_000_000,
      runwayImpactMonths: monthlyBurn > 0 ? -18_000_000 / monthlyBurn : -1.8,
      marginImpact: -0.018
    }
  ];
}

export function buildBudgetVariance(workspace: DemoWorkspace): BudgetVariance[] {
  const base = workspace.financials.operatingExpenses;
  const rows = [
    ["Sales & Marketing", 0.24, 0.27],
    ["Operations", 0.32, 0.34],
    ["Finance & Admin", 0.13, 0.12],
    ["Technology / Systems", 0.18, workspace.id === "saas" ? 0.22 : 0.17],
    ["People Cost", 0.13, workspace.id === "saas" ? 0.17 : 0.14]
  ] as const;

  return rows.map(([department, budgetRatio, actualRatio]) => {
    const budget = base * budgetRatio;
    const actual = base * actualRatio;
    const variance = actual - budget;

    return {
      department,
      budget,
      actual,
      variance,
      status: variance <= budget * 0.02 ? "green" : variance <= budget * 0.12 ? "amber" : "red"
    };
  });
}

export function buildInsightBlueprint(workspace: DemoWorkspace): InsightBlueprint {
  const metrics = computeMetrics(workspace.financials);

  return {
    workspaceId: workspace.id,
    generatedAt: new Date().toISOString(),
    privacyBoundary: "masked-kpi-blueprint",
    maskedKpis: metrics.slice(0, 10).map((metric) => ({
      metric: metric.name,
      direction: metric.rawValue > 0.12 ? "up" : metric.rawValue < 0.03 ? "down" : "flat",
      magnitude: Math.abs(metric.rawValue) > 1 ? "high" : Math.abs(metric.rawValue) > 0.2 ? "medium" : "low",
      status: metric.status
    })),
    findingSummary: workspace.findings.map((finding) => ({
      findingType: finding.type,
      severity: finding.severity,
      confidenceBand: finding.confidence >= 0.8 ? "high" : finding.confidence >= 0.6 ? "medium" : "low"
    })),
    neverIncluded: [
      "raw rupee transaction rows",
      "customer or vendor legal names",
      "payroll identities",
      "bank account numbers",
      "uploaded file contents"
    ]
  };
}
