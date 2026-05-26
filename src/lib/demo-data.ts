import type { DemoWorkspace } from "./types";

export const demoWorkspaces: DemoWorkspace[] = [
  {
    id: "manufacturing",
    name: "Aarav Components",
    industry: "Manufacturing",
    companySize: "850 employees",
    fiscalYear: "FY 2025-26",
    tagline: "Inventory, vendor, and working-capital intelligence for a precision-parts manufacturer.",
    narrative:
      "This demo shows Schedule III statements, purchase/AP files, and inventory data with gross margin pressure, inventory shrinkage, and supplier concentration risk.",
    roleFocus: ["CFO / Finance Head", "Finance Manager", "Analyst", "Auditor"],
    documents: [
      {
        id: "mfg-pl",
        name: "Aarav_PnL_FY26_Q3.xlsx",
        type: "P&L",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 91,
        rows: 148,
        filePath: "/demo-files/manufacturing/Aarav_PnL_FY26_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: ["Two subtotal rows excluded from normalized records."],
        unlocks: ["Profitability ratios", "Gross margin bridge", "EBITDA trend"]
      },
      {
        id: "mfg-bs",
        name: "Aarav_Balance_Sheet_FY26_Q3.xlsx",
        type: "Balance Sheet",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 88,
        rows: 126,
        filePath: "/demo-files/manufacturing/Aarav_Balance_Sheet_FY26_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Current liabilities label mapped from 'Short-term obligations'."],
        unlocks: ["Liquidity ratios", "Debt analysis", "Net worth analysis"]
      },
      {
        id: "mfg-cf",
        name: "Aarav_Cash_Flow_FY26_Q3.xlsx",
        type: "Cash Flow",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 93,
        rows: 72,
        filePath: "/demo-files/manufacturing/Aarav_Cash_Flow_FY26_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: [],
        unlocks: ["Operating cash flow ratio", "Cash reconciliation"]
      },
      {
        id: "mfg-inventory",
        name: "Aarav_Inventory_SKU_Q3.xlsx",
        type: "Inventory",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 82,
        rows: 1834,
        filePath: "/demo-files/manufacturing/Aarav_Inventory_SKU_Q3.xlsx",
        mappingStatus: "Needs Review",
        warnings: ["11 SKU rows have missing category values.", "Unit labels use mixed pieces/kg notation."],
        unlocks: ["DIO", "Shrinkage detection", "Dead stock flags"]
      },
      {
        id: "mfg-ap",
        name: "Aarav_AP_Purchase_Ledger_Q3.xlsx",
        type: "AP Ledger",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 86,
        rows: 984,
        filePath: "/demo-files/manufacturing/Aarav_AP_Purchase_Ledger_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Potential duplicate invoice cluster detected."],
        unlocks: ["DPO", "Vendor concentration", "Duplicate payment detection"]
      },
      {
        id: "mfg-sales",
        name: "Aarav_Sales_Register_Q3.xlsx",
        type: "Sales Register",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 90,
        rows: 6240,
        filePath: "/demo-files/manufacturing/Aarav_Sales_Register_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: ["Three customer codes mapped from historical aliases."],
        unlocks: ["Customer concentration", "Revenue growth", "Pricing variance"]
      },
      {
        id: "mfg-budget",
        name: "Aarav_Budget_Vs_Actual_Q3.xlsx",
        type: "Budget",
        category: "Compliance",
        period: "Q3 FY26",
        healthScore: 87,
        rows: 84,
        filePath: "/demo-files/manufacturing/Aarav_Budget_Vs_Actual_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Two department labels normalized from cost-center codes."],
        unlocks: ["Budget variance", "Cost center overruns", "Forecast vs budget"]
      }
    ],
    financials: {
      revenue: 482000000,
      cogs: 318000000,
      operatingExpenses: 82000000,
      ebitda: 82000000,
      netProfit: 38600000,
      currentAssets: 214000000,
      inventory: 94000000,
      cash: 38000000,
      currentLiabilities: 168000000,
      totalDebt: 226000000,
      equity: 174000000,
      totalAssets: 612000000,
      operatingCashFlow: 69000000,
      accountsReceivable: 106000000,
      accountsPayable: 88000000,
      previousRevenue: 438000000
    },
    findings: [
      {
        id: "mfg-shrinkage",
        type: "leak",
        title: "Inventory shrinkage concentrated in fastener category",
        severity: "High",
        estimatedValue: 12800000,
        confidence: 0.84,
        status: "New",
        recommendation: "Reconcile SKU movement for the top 24 discrepant items and inspect warehouse issue logs.",
        lineageRefs: ["mfg-inventory", "pl-cogs"]
      },
      {
        id: "mfg-duplicate-ap",
        type: "leak",
        title: "Possible duplicate vendor invoices",
        severity: "Medium",
        estimatedValue: 3400000,
        confidence: 0.72,
        status: "Investigating",
        recommendation: "Review invoices with same vendor, amount, and invoice date within 30 days.",
        lineageRefs: ["mfg-ap"]
      }
    ],
    forecast: [
      { period: "Q1", actual: 402000000, forecast: 405000000 },
      { period: "Q2", actual: 438000000, forecast: 431000000 },
      { period: "Q3", actual: 482000000, forecast: 474000000 },
      { period: "Q4", forecast: 505000000 },
      { period: "Q1 FY27", forecast: 529000000 }
    ],
    lineage: [
      {
        id: "pl-revenue",
        formulaUsed: "Revenue from operations from P&L normalized account taxonomy.",
        sourceDocumentId: "mfg-pl",
        sourceSheet: "Statement",
        sourceRows: [18],
        extractedValuesUsed: ["Revenue from Operations"],
        period: "Q3 FY26",
        computedByScriptVersion: "ratio-engine@0.1.0"
      },
      {
        id: "bs-current-assets",
        formulaUsed: "Sum of Schedule III current asset lines.",
        sourceDocumentId: "mfg-bs",
        sourceSheet: "Balance Sheet",
        sourceRows: [44, 45, 46, 47],
        extractedValuesUsed: ["Inventory", "Trade Receivables", "Cash", "Other Current Assets"],
        period: "Q3 FY26",
        computedByScriptVersion: "taxonomy-mapper@0.1.0"
      }
    ]
  },
  {
    id: "retail",
    name: "Nila Retail Mart",
    industry: "Retail",
    companySize: "42 stores",
    fiscalYear: "FY 2025-26",
    tagline: "Pricing, discount, GST, and stock intelligence for a multi-store retailer.",
    narrative:
      "This demo highlights store-level sales, unauthorized discounts, GST input credit leakage, inventory ageing, and same-store sales forecasting.",
    roleFocus: ["CFO / Finance Head", "Finance Manager", "Analyst"],
    documents: [
      {
        id: "retail-sales",
        name: "Nila_Store_Sales_Q3.xlsx",
        type: "Sales Register",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 84,
        rows: 22480,
        filePath: "/demo-files/retail/Nila_Store_Sales_Q3.xlsx",
        mappingStatus: "Needs Review",
        warnings: ["Discount column inferred at 0.76 confidence.", "3 store codes missing region mapping."],
        unlocks: ["Pricing leakage", "Discount abuse", "Same-store sales"]
      },
      {
        id: "retail-gst",
        name: "Nila_GST_2B_3B_Q3.xlsx",
        type: "GST Summary",
        category: "Compliance",
        period: "Q3 FY26",
        healthScore: 89,
        rows: 326,
        filePath: "/demo-files/retail/Nila_GST_2B_3B_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Two supplier GSTINs appear in 2B but not in 3B claim extract."],
        unlocks: ["ITC gap detection", "Tax leakage"]
      },
      {
        id: "retail-inventory",
        name: "Nila_Inventory_Ageing_Q3.xlsx",
        type: "Inventory",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 87,
        rows: 8910,
        filePath: "/demo-files/retail/Nila_Inventory_Ageing_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Ageing bucket labels normalized from custom store export."],
        unlocks: ["Dead stock", "Inventory turnover", "DIO"]
      },
      {
        id: "retail-pl",
        name: "Nila_PnL_Q3.xlsx",
        type: "P&L",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 92,
        rows: 118,
        filePath: "/demo-files/retail/Nila_PnL_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: [],
        unlocks: ["Profitability ratios", "Expense trend"]
      },
      {
        id: "retail-bs",
        name: "Nila_Balance_Sheet_Q3.xlsx",
        type: "Balance Sheet",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 91,
        rows: 112,
        filePath: "/demo-files/retail/Nila_Balance_Sheet_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: [],
        unlocks: ["Liquidity ratios", "Working capital", "Debt analysis"]
      },
      {
        id: "retail-vendor",
        name: "Nila_Vendor_Ledger_Q3.xlsx",
        type: "AP Ledger",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 86,
        rows: 1430,
        filePath: "/demo-files/retail/Nila_Vendor_Ledger_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Five supplier GSTINs need confirmation."],
        unlocks: ["Vendor concentration", "AP leakage", "DPO"]
      },
      {
        id: "retail-budget",
        name: "Nila_Budget_Vs_Actual_Q3.xlsx",
        type: "Budget",
        category: "Compliance",
        period: "Q3 FY26",
        healthScore: 88,
        rows: 76,
        filePath: "/demo-files/retail/Nila_Budget_Vs_Actual_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["Store marketing budget mapped from regional budget file."],
        unlocks: ["Store variance", "Budget adherence", "Overrun detection"]
      }
    ],
    financials: {
      revenue: 286000000,
      cogs: 179000000,
      operatingExpenses: 73000000,
      ebitda: 34000000,
      netProfit: 15600000,
      currentAssets: 142000000,
      inventory: 66000000,
      cash: 21000000,
      currentLiabilities: 92000000,
      totalDebt: 76000000,
      equity: 119000000,
      totalAssets: 301000000,
      operatingCashFlow: 29000000,
      accountsReceivable: 26000000,
      accountsPayable: 51000000,
      previousRevenue: 262000000
    },
    findings: [
      {
        id: "retail-discount",
        type: "leak",
        title: "Unauthorized discounting above 15% in western stores",
        severity: "High",
        estimatedValue: 7200000,
        confidence: 0.81,
        status: "New",
        recommendation: "Audit transactions where discount exceeds policy and compare against approval records.",
        lineageRefs: ["retail-sales"]
      },
      {
        id: "retail-itc",
        type: "leak",
        title: "GST input credit appears under-claimed",
        severity: "Medium",
        estimatedValue: 2100000,
        confidence: 0.68,
        status: "New",
        recommendation: "Reconcile supplier-reported GSTR-2B entries with claimed GSTR-3B ITC.",
        lineageRefs: ["retail-gst"]
      }
    ],
    forecast: [
      { period: "Oct", actual: 88000000, forecast: 87000000 },
      { period: "Nov", actual: 94000000, forecast: 92000000 },
      { period: "Dec", actual: 104000000, forecast: 101000000 },
      { period: "Jan", forecast: 98000000 },
      { period: "Feb", forecast: 91000000 }
    ],
    lineage: [
      {
        id: "pl-revenue",
        formulaUsed: "Revenue from sales register reconciled to P&L revenue.",
        sourceDocumentId: "retail-sales",
        sourceSheet: "Q3 Sales",
        sourceRows: [2, 3, 4, 22481],
        extractedValuesUsed: ["Net Sales Amount", "GST Component"],
        period: "Q3 FY26",
        computedByScriptVersion: "revenue-reconcile@0.1.0"
      }
    ]
  },
  {
    id: "saas",
    name: "VectorCloud Systems",
    industry: "SaaS / Technology",
    companySize: "320 employees",
    fiscalYear: "FY 2025-26",
    tagline: "Runway, recurring revenue, collections, and hiring-impact analysis for a B2B SaaS company.",
    narrative:
      "This demo uses subscription sales, AR ageing, payroll, P&L, and cash flow to show customer concentration, collection leakage, runway, and growth scenarios.",
    roleFocus: ["CFO / Finance Head", "Finance Manager", "Analyst", "Viewer"],
    documents: [
      {
        id: "saas-crm",
        name: "VectorCloud_Subscription_CRM_Q3.xlsx",
        type: "Sales Register",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 85,
        rows: 4120,
        filePath: "/demo-files/saas/VectorCloud_Subscription_CRM_Q3.xlsx",
        mappingStatus: "Needs Review",
        warnings: ["Renewal date column inferred from mixed date formats."],
        unlocks: ["MRR trend", "Customer concentration", "Churn proxy"]
      },
      {
        id: "saas-ar",
        name: "VectorCloud_AR_Ageing_Q3.xlsx",
        type: "AR Ledger",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 90,
        rows: 642,
        filePath: "/demo-files/saas/VectorCloud_AR_Ageing_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["18 invoices older than 90 days."],
        unlocks: ["DSO", "Collection leakage", "Bad debt risk"]
      },
      {
        id: "saas-payroll",
        name: "VectorCloud_Payroll_Summary_Q3.xlsx",
        type: "Payroll",
        category: "Operations",
        period: "Q3 FY26",
        healthScore: 93,
        rows: 86,
        filePath: "/demo-files/saas/VectorCloud_Payroll_Summary_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: [],
        unlocks: ["People cost ratio", "Hiring-impact model"]
      },
      {
        id: "saas-pl",
        name: "VectorCloud_PnL_Q3.xlsx",
        type: "P&L",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 95,
        rows: 104,
        filePath: "/demo-files/saas/VectorCloud_PnL_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: [],
        unlocks: ["Profitability ratios", "Runway"]
      },
      {
        id: "saas-bs",
        name: "VectorCloud_Balance_Sheet_Q3.xlsx",
        type: "Balance Sheet",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 94,
        rows: 96,
        filePath: "/demo-files/saas/VectorCloud_Balance_Sheet_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: [],
        unlocks: ["Liquidity", "Net worth", "Debt analysis"]
      },
      {
        id: "saas-cf",
        name: "VectorCloud_Cash_Flow_Q3.xlsx",
        type: "Cash Flow",
        category: "Core Financials",
        period: "Q3 FY26",
        healthScore: 92,
        rows: 68,
        filePath: "/demo-files/saas/VectorCloud_Cash_Flow_Q3.xlsx",
        mappingStatus: "Validated",
        warnings: ["Financing cash flow mapped from board pack format."],
        unlocks: ["Runway", "Burn rate", "Operating cash flow"]
      },
      {
        id: "saas-budget",
        name: "VectorCloud_Budget_Vs_Actual_Q3.xlsx",
        type: "Budget",
        category: "Compliance",
        period: "Q3 FY26",
        healthScore: 89,
        rows: 82,
        filePath: "/demo-files/saas/VectorCloud_Budget_Vs_Actual_Q3.xlsx",
        mappingStatus: "Mapped",
        warnings: ["R&D contractors grouped into product engineering."],
        unlocks: ["Department variance", "Hiring impact", "Forecast vs budget"]
      }
    ],
    financials: {
      revenue: 164000000,
      cogs: 42000000,
      operatingExpenses: 116000000,
      ebitda: 6000000,
      netProfit: -4200000,
      currentAssets: 118000000,
      inventory: 0,
      cash: 78000000,
      currentLiabilities: 73000000,
      totalDebt: 31000000,
      equity: 142000000,
      totalAssets: 252000000,
      operatingCashFlow: -9000000,
      accountsReceivable: 54000000,
      accountsPayable: 18000000,
      previousRevenue: 139000000
    },
    findings: [
      {
        id: "saas-collections",
        type: "leak",
        title: "Collection leakage from aged enterprise invoices",
        severity: "High",
        estimatedValue: 9300000,
        confidence: 0.79,
        status: "Investigating",
        recommendation: "Prioritize top 12 invoices over 90 days and update renewal holds for overdue accounts.",
        lineageRefs: ["saas-ar"]
      },
      {
        id: "saas-concentration",
        type: "anomaly",
        title: "Top customer concentration rose above policy threshold",
        severity: "Medium",
        estimatedValue: 0,
        confidence: 0.74,
        status: "New",
        recommendation: "Review enterprise concentration and simulate downside impact if top customer churns.",
        lineageRefs: ["saas-crm"]
      }
    ],
    forecast: [
      { period: "Oct", actual: 50000000, forecast: 49000000 },
      { period: "Nov", actual: 54000000, forecast: 53000000 },
      { period: "Dec", actual: 60000000, forecast: 58500000 },
      { period: "Jan", forecast: 63500000 },
      { period: "Feb", forecast: 67200000 }
    ],
    lineage: [
      {
        id: "ar-ledger",
        formulaUsed: "Open invoice ageing from AR ledger grouped by customer and due date.",
        sourceDocumentId: "saas-ar",
        sourceSheet: "Ageing",
        sourceRows: [19, 28, 41, 55],
        extractedValuesUsed: ["Invoice Amount", "Due Date", "Collected Amount"],
        period: "Q3 FY26",
        computedByScriptVersion: "collections-engine@0.1.0"
      }
    ]
  }
];

export function getWorkspace(id: string | undefined) {
  return demoWorkspaces.find((workspace) => workspace.id === id) ?? demoWorkspaces[0];
}
