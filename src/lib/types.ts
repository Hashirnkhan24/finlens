export type Role =
  | "Org Admin"
  | "CFO / Finance Head"
  | "Finance Manager"
  | "Analyst"
  | "Auditor"
  | "Viewer";

export type Sector = "manufacturing" | "retail" | "saas";

export type DocumentType =
  | "P&L"
  | "Balance Sheet"
  | "Cash Flow"
  | "Sales Register"
  | "AR Ledger"
  | "AP Ledger"
  | "Inventory"
  | "GST Summary"
  | "Payroll"
  | "Budget";

export type DemoDocument = {
  id: string;
  name: string;
  type: DocumentType;
  category: "Core Financials" | "Operations" | "Compliance";
  period: string;
  healthScore: number;
  rows: number;
  filePath: string;
  mappingStatus: "Mapped" | "Needs Review" | "Validated";
  warnings: string[];
  unlocks: string[];
};

export type Financials = {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  ebitda: number;
  netProfit: number;
  currentAssets: number;
  inventory: number;
  cash: number;
  currentLiabilities: number;
  totalDebt: number;
  equity: number;
  totalAssets: number;
  operatingCashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  previousRevenue: number;
};

export type Finding = {
  id: string;
  type: "leak" | "anomaly" | "ratio_breach" | "reconciliation_fail";
  title: string;
  severity: "High" | "Medium" | "Low";
  estimatedValue: number;
  confidence: number;
  status: "New" | "Investigating" | "Reviewed" | "Dismissed";
  recommendation: string;
  lineageRefs: string[];
};

export type ForecastPoint = {
  period: string;
  actual?: number;
  forecast: number;
};

export type Metric = {
  id: string;
  name: string;
  value: string;
  rawValue: number;
  status: "green" | "amber" | "red";
  formula: string;
  interpretation: string;
  lineageRefs: string[];
};

export type LineageRecord = {
  id: string;
  formulaUsed: string;
  sourceDocumentId: string;
  sourceSheet: string;
  sourceRows: number[];
  extractedValuesUsed: string[];
  period: string;
  computedByScriptVersion: string;
};

export type DemoWorkspace = {
  id: Sector;
  name: string;
  industry: string;
  companySize: string;
  fiscalYear: string;
  tagline: string;
  narrative: string;
  roleFocus: Role[];
  documents: DemoDocument[];
  financials: Financials;
  findings: Finding[];
  forecast: ForecastPoint[];
  lineage: LineageRecord[];
};

export type MetricGroup = {
  title: string;
  metrics: Metric[];
};

export type Scenario = {
  id: string;
  name: string;
  assumption: string;
  ebitdaImpact: number;
  runwayImpactMonths: number;
  marginImpact: number;
};

export type BudgetVariance = {
  department: string;
  budget: number;
  actual: number;
  variance: number;
  status: Metric["status"];
};

export type InsightBlueprint = {
  workspaceId: Sector;
  generatedAt: string;
  privacyBoundary: "masked-kpi-blueprint";
  maskedKpis: Array<{
    metric: string;
    direction: "up" | "down" | "flat";
    magnitude: "low" | "medium" | "high";
    status: Metric["status"];
  }>;
  findingSummary: Array<{
    findingType: Finding["type"];
    severity: Finding["severity"];
    confidenceBand: "low" | "medium" | "high";
  }>;
  neverIncluded: string[];
};
