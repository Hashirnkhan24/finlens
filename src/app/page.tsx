import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  Calculator,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  GitBranch,
  IndianRupee,
  Layers3,
  LineChart,
  Lock,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthNav } from "@/components/auth-nav";
import { demoWorkspaces } from "@/lib/demo-data";

const capabilities = [
  {
    icon: BarChart3,
    title: "Financial Analysis",
    copy: "Profitability, liquidity, working capital, leverage, efficiency, cash runway, and operating health."
  },
  {
    icon: Activity,
    title: "Revenue Leak Detection",
    copy: "Duplicate invoices, pricing leakage, delayed collections, GST gaps, inventory shrinkage, and payroll anomalies."
  },
  {
    icon: TrendingUp,
    title: "Forecasting",
    copy: "Revenue, cash flow, expense, collections, inventory demand, runway, and working-capital forecasts."
  },
  {
    icon: Calculator,
    title: "Financial Modeling",
    copy: "Scenario controls for pricing, hiring, spend, collections, COGS, and break-even sensitivity."
  },
  {
    icon: Layers3,
    title: "Budgeting & Variance",
    copy: "Budget vs actuals, departmental variance, cost-center overruns, and forecast-to-budget tracking."
  },
  {
    icon: GitBranch,
    title: "Audit Trail & Lineage",
    copy: "Every KPI resolves to a source file, sheet, row range, normalized field, formula, and compute version."
  }
];

const workflow = [
  "Upload finance and operations files",
  "Normalize schema and map fields",
  "Validate quality and reconcile totals",
  "Compute deterministic finance metrics",
  "Detect anomalies and leakage",
  "Forecast outcomes and generate narrative"
];

const dataSources = ["Excel sheets", "ERP exports", "GST reports", "Inventory systems", "Payroll", "Vendor ledgers", "Sales registers", "Budget files"];

const industryIcon = {
  manufacturing: Boxes,
  retail: Building2,
  saas: LineChart
};

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">FL</span>
          <span>
            FinLens
            <small>Finance Intelligence OS</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#workflow">Workflow</a>
          <a href="#platform">Platform</a>
          <a href="/demo">Demo</a>
          <ThemeToggle />
          <AuthNav />
        </nav>
      </header>

      <section className="hero landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <ShieldCheck size={16} /> Python computes. AI explains. Raw data stays private.
          </span>
          <h1>Turn messy financial data into finance intelligence.</h1>
          <p>
            FinLens ingests accounting, operational, tax, payroll, inventory, and sales files to compute financial
            health, detect revenue leakage, forecast outcomes, and generate audit-ready insights without exposing raw
            data to AI.
          </p>
          <div className="action-row">
            <a className="button primary" href="/demo">
              Try Interactive Demo <ArrowRight size={17} />
            </a>
            <a className="button ghost" href="#workflow">
              View Platform Workflow
            </a>
          </div>
        </div>

        <div className="ops-preview hero-terminal" aria-label="Finance operating layer preview">
          <div className="search-rail">
            <SearchIcon />
            <span>Search ratios, leaks, files, forecasts...</span>
          </div>
          <div className="preview-header">
            <span>Finance Health</span>
            <strong>82 / 100</strong>
          </div>
          <div className="signal-grid">
            <div>
              <small>Leakage Exposure</small>
              <strong>₹2.74 Cr</strong>
              <span className="risk amber">Recoverable</span>
            </div>
            <div>
              <small>Cash Runway</small>
              <strong>8.7 mo</strong>
              <span className="risk green">Stable</span>
            </div>
            <div>
              <small>Forecast Risk</small>
              <strong>Medium</strong>
              <span className="risk amber">Watch DSO</span>
            </div>
            <div>
              <small>Lineage</small>
              <strong>100%</strong>
              <span className="risk green">Traceable</span>
            </div>
          </div>
          <div className="flow-stack">
            {workflow.slice(0, 4).map((step, index) => (
              <div className="flow-step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
                <CheckCircle2 size={16} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section problem-section">
        <div className="section-heading">
          <span className="eyebrow muted">
            <Database size={16} /> The core problem
          </span>
          <h2>Finance data lives everywhere.</h2>
          <p>
            Finance teams spend weeks cleaning, matching, and reconciling files before they can answer board-level
            questions. FinLens turns those disconnected files into one traceable intelligence layer.
          </p>
        </div>
        <div className="source-grid">
          {dataSources.map((source) => (
            <div className="source-tile" key={source}>
              <FileSpreadsheet size={18} />
              <span>{source}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="platform">
        <div className="section-heading">
          <span className="eyebrow muted">
            <IndianRupee size={16} /> What FinLens does
          </span>
          <h2>A finance operating layer, not a chart wall.</h2>
          <p>
            The platform is organized around finance workflows: health, leakage, forecasting, modeling, budgeting,
            auditability, and board-ready narrative.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <article className="capability-card" key={capability.title}>
                <Icon size={22} />
                <h3>{capability.title}</h3>
                <p>{capability.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section workflow-section" id="workflow">
        <div className="section-heading">
          <span className="eyebrow muted">
            <GitBranch size={16} /> Platform workflow
          </span>
          <h2>From raw files to decision intelligence.</h2>
        </div>
        <div className="workflow-grid">
          {workflow.map((step, index) => (
            <div className="workflow-card" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow muted">
            <FileSpreadsheet size={16} /> Demo workspaces
          </span>
          <h2>Explore real finance workflows with downloadable Excel inputs.</h2>
        </div>
        <div className="demo-grid">
          {demoWorkspaces.map((workspace) => {
            const Icon = industryIcon[workspace.id];
            return (
              <a className="demo-card" href={`/demo/${workspace.id}`} key={workspace.id}>
                <Icon size={24} />
                <h3>{workspace.industry}</h3>
                <p>{workspace.tagline}</p>
                <div className="meta-row">
                  <span>{workspace.documents.length} files</span>
                  <span>{workspace.fiscalYear}</span>
                  <span>{workspace.companySize}</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="section trust-section">
        <div className="section-heading">
          <span className="eyebrow">
            <Lock size={16} /> Privacy and trust
          </span>
          <h2>The LLM never needs your raw ledger.</h2>
          <p>
            FinLens computes metrics deterministically, builds a masked KPI blueprint, and sends only status, direction,
            magnitude, and finding categories for narrative generation.
          </p>
        </div>
        <div className="trust-grid">
          {["Raw rows stay inside FinLens", "Masked KPI blueprint only", "Formula-level audit trace", "Source file and row lineage"].map((item) => (
            <div className="trust-item" key={item}>
              <ShieldCheck size={18} />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Explore a guided finance workspace.</h2>
        <a className="button primary" href="/demo">
          Try Demo <ArrowRight size={17} />
        </a>
      </section>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
