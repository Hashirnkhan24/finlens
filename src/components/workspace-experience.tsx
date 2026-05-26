"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bot,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  GitBranch,
  LineChart,
  Minus,
  Search,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { useState } from "react";
import {
  buildBudgetVariance,
  buildScenarios,
  computeFinanceHealth,
  computeMetricGroups,
  computeMetrics,
  formatInr
} from "@/lib/finance";
import type { DemoDocument, DemoWorkspace, Metric, Scenario } from "@/lib/types";
import {
  WaterfallChart,
  DonutChart,
  ForecastLineChart,
  ScenarioBarChart,
  VarianceBarChart,
  CashRunwayAreaChart
} from "./charts";

const tabs = [
  "Financial Analysis",
  "Revenue Leaks",
  "Forecasting",
  "Modeling",
  "Budgeting",
  "Audit Trail",
  "Board Summary"
] as const;

type Tab = (typeof tabs)[number];

const statusText: Record<Metric["status"], string> = {
  green: "Healthy",
  amber: "Watch",
  red: "Risk"
};

function Pill({ status, children }: { status?: Metric["status"] | "amber" | "green" | "red"; children: React.ReactNode }) {
  return <span className={`risk ${status ?? ""}`}>{children}</span>;
}

function groupDocuments(documents: DemoDocument[]) {
  return documents.reduce<Record<DemoDocument["category"], DemoDocument[]>>(
    (groups, document) => {
      groups[document.category].push(document);
      return groups;
    },
    { "Core Financials": [], Operations: [], Compliance: [] }
  );
}

function MetricTile({ metric }: { metric: Metric }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{metric.name}</span>
        <Pill status={metric.status}>{statusText[metric.status]}</Pill>
      </div>
      <strong>{metric.value}</strong>
      <p>{metric.interpretation}</p>
      <small>
        <Search size={13} /> {metric.lineageRefs.join(", ")}
      </small>
    </article>
  );
}

function FinancialAnalysis({ workspace }: { workspace: DemoWorkspace }) {
  const groups = computeMetricGroups(workspace.financials);

  return (
    <div className="tab-stack">
      <WaterfallChart financials={workspace.financials} />
      {groups.map((group) => (
        <section className="ops-panel" key={group.title}>
          <div className="panel-heading">
            <h2>{group.title}</h2>
            <span>{group.metrics.length} KPIs</span>
          </div>
          <div className="metric-grid">
            {group.metrics.map((metric) => (
              <MetricTile metric={metric} key={metric.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function RevenueLeaks({ workspace }: { workspace: DemoWorkspace }) {
  const categories = ["Pricing Leakage", "Collections Leakage", "AP Leakage", "Inventory Leakage", "Payroll Leakage", "Tax Leakage"];

  return (
    <div className="tab-stack">
      <section className="ops-panel">
        <div className="panel-heading">
          <h2>Leak Inbox</h2>
          <Pill status="amber">{workspace.findings.length} active findings</Pill>
        </div>
        <div className="finding-list">
          {workspace.findings.map((finding) => (
            <article className="finding-card" key={finding.id}>
              <div>
                <h3>{finding.title}</h3>
                <p>{finding.recommendation}</p>
              </div>
              <Pill status={finding.severity === "High" ? "red" : "amber"}>{finding.severity}</Pill>
              <strong>{finding.estimatedValue > 0 ? formatInr(finding.estimatedValue) : "Policy risk"}</strong>
              <span>{Math.round(finding.confidence * 100)}% confidence</span>
            </article>
          ))}
        </div>
      </section>
      <DonutChart workspace={workspace} />
      <section className="ops-panel">
        <div className="panel-heading">
          <h2>Leak Coverage</h2>
          <span>Simulated detection modules</span>
        </div>
        <div className="coverage-grid">
          {categories.map((category, index) => (
            <div className="coverage-card" key={category}>
              <span>{category}</span>
              <strong>{index < 4 ? "Active" : "Ready"}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Forecasting({ workspace }: { workspace: DemoWorkspace }) {
  const max = Math.max(...workspace.forecast.map((point) => Math.max(point.actual ?? 0, point.forecast)));

  return (
    <>
      <section className="ops-panel">
        <div className="panel-heading">
          <h2>FP&A Forecast Workbench</h2>
          <Pill status="green">Actual vs forecast</Pill>
        </div>
        <div className="forecast-chart">
          {workspace.forecast.map((point) => (
            <div className="forecast-column" key={point.period}>
              <div className="forecast-bars">
                {point.actual ? (
                  <span className="bar actual" style={{ height: `${Math.max(18, (point.actual / max) * 190)}px` }} title={formatInr(point.actual)} />
                ) : null}
                <span className="bar forecast" style={{ height: `${Math.max(18, (point.forecast / max) * 190)}px` }} title={formatInr(point.forecast)} />
              </div>
              <small>{point.period}</small>
            </div>
          ))}
        </div>
        <div className="insight-strip">
          <span>Confidence band: medium</span>
          <span>Primary driver: revenue seasonality</span>
          <span>Watch item: receivable conversion</span>
        </div>
      </section>
      <ForecastLineChart workspace={workspace} />
    </>
  );
}

function Modeling({ workspace }: { workspace: DemoWorkspace }) {
  const scenarios = buildScenarios(workspace);

  return (
    <>
      <ScenarioBarChart scenarios={scenarios} />
      <section className="ops-panel">
        <div className="panel-heading">
          <h2>Scenario Detail</h2>
          <Pill status="amber">
            <SlidersHorizontal size={14} /> What-if engine
          </Pill>
        </div>
        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <article className="scenario-card" key={scenario.id}>
              <h3>{scenario.name}</h3>
              <p>{scenario.assumption}</p>
              <div>
                <span>EBITDA impact</span>
                <strong>{formatInr(scenario.ebitdaImpact)}</strong>
              </div>
              <div>
                <span>Runway impact</span>
                <strong>{scenario.runwayImpactMonths.toFixed(1)} mo</strong>
              </div>
              <div>
                <span>Margin impact</span>
                <strong>{(scenario.marginImpact * 100).toFixed(1)}%</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Budgeting({ workspace }: { workspace: DemoWorkspace }) {
  const rows = buildBudgetVariance(workspace);
  const totalVariance = rows.reduce((total, row) => total + row.variance, 0);

  return (
    <>
      <VarianceBarChart rows={rows} />
      <section className="ops-panel">
        <div className="panel-heading">
          <h2>Variance Detail</h2>
          <Pill status={totalVariance > 0 ? "amber" : "green"}>{formatInr(totalVariance)} total variance</Pill>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Budget</th>
                <th>Actual</th>
                <th>Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.department}>
                  <td>{row.department}</td>
                  <td>{formatInr(row.budget)}</td>
                  <td>{formatInr(row.actual)}</td>
                  <td>{formatInr(row.variance)}</td>
                  <td>
                    <Pill status={row.status}>{statusText[row.status]}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AuditTrail({ workspace }: { workspace: DemoWorkspace }) {
  return (
    <section className="ops-panel">
      <div className="panel-heading">
        <h2>Audit Trail & Lineage</h2>
        <Pill status="green">
          <GitBranch size={14} /> Traceable
        </Pill>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>KPI / Trace</th>
              <th>Formula</th>
              <th>Source</th>
              <th>Rows</th>
              <th>Engine</th>
            </tr>
          </thead>
          <tbody>
            {workspace.lineage.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.formulaUsed}</td>
                <td>
                  {item.sourceDocumentId}
                  <small>{item.sourceSheet}</small>
                </td>
                <td>{item.sourceRows.join(", ")}</td>
                <td>{item.computedByScriptVersion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BoardSummary({ workspace }: { workspace: DemoWorkspace }) {
  const f = workspace.financials;
  const metrics = computeMetrics(f);
  const getMetric = (id: string) => metrics.find((m) => m.id === id);

  const grossMargin = getMetric("gross-margin");
  const ebitdaMargin = getMetric("ebitda-margin");
  const cashRunway = getMetric("cash-runway");
  const revenueGrowth = getMetric("revenue-growth");

  const highFindings = workspace.findings.filter((x) => x.severity === "High");
  const medFindings = workspace.findings.filter((x) => x.severity === "Medium");
  const lowFindings = workspace.findings.filter((x) => x.severity === "Low");

  function TrendIcon({ value }: { value: number }) {
    if (value > 0.03) return <ArrowUp size={16} style={{ color: "var(--green)" }} />;
    if (value < -0.03) return <ArrowDown size={16} style={{ color: "var(--red)" }} />;
    return <Minus size={16} style={{ color: "var(--muted)" }} />;
  }

  return (
    <>
      <section className="ops-panel">
        <div className="panel-heading">
          <h2>Board-ready Finance Narrative</h2>
          <Pill status="green">Draft memo</Pill>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 18
        }}>
          <div className="metric-card" style={{ minHeight: 0 }}>
            <div className="metric-top">
              <span>Revenue</span>
              <TrendIcon value={(f.revenue - f.previousRevenue) / f.previousRevenue} />
            </div>
            <strong>{formatInr(f.revenue)}</strong>
          </div>
          <div className="metric-card" style={{ minHeight: 0 }}>
            <div className="metric-top">
              <span>Gross Margin</span>
              {grossMargin ? <Pill status={grossMargin.status}>{Number(grossMargin.rawValue * 100).toFixed(1)}%</Pill> : null}
            </div>
            <strong>{grossMargin?.value ?? "--"}</strong>
          </div>
          <div className="metric-card" style={{ minHeight: 0 }}>
            <div className="metric-top">
              <span>EBITDA Margin</span>
              {ebitdaMargin ? <Pill status={ebitdaMargin.status}>{Number(ebitdaMargin.rawValue * 100).toFixed(1)}%</Pill> : null}
            </div>
            <strong>{ebitdaMargin?.value ?? "--"}</strong>
          </div>
          <div className="metric-card" style={{ minHeight: 0 }}>
            <div className="metric-top">
              <span>Cash Runway</span>
              {cashRunway ? <Pill status={cashRunway.status}>{cashRunway.value}</Pill> : null}
            </div>
            <strong>{cashRunway ? (cashRunway.rawValue >= 24 ? "24+ mo" : `${Number(cashRunway.rawValue).toFixed(1)} mo`) : "--"}</strong>
          </div>
        </div>

        <CashRunwayAreaChart workspace={workspace} />

        <div style={{
          display: "flex",
          gap: 16,
          marginTop: 18,
          padding: 14,
          border: "1px solid var(--line-soft)",
          borderRadius: 12,
          background: "var(--inset)"
        }}>
          <div style={{ flex: 1 }}>
            <small style={{ color: "var(--muted)", fontSize: 12 }}>High Risk Findings</small>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--red)", marginTop: 4 }}>{highFindings.length}</div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {formatInr(highFindings.reduce((s, x) => s + x.estimatedValue, 0))}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <small style={{ color: "var(--muted)", fontSize: 12 }}>Medium Risk</small>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--amber)", marginTop: 4 }}>{medFindings.length}</div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {formatInr(medFindings.reduce((s, x) => s + x.estimatedValue, 0))}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <small style={{ color: "var(--muted)", fontSize: 12 }}>Low Risk</small>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--green)", marginTop: 4 }}>{lowFindings.length}</div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {formatInr(lowFindings.reduce((s, x) => s + x.estimatedValue, 0))}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <small style={{ color: "var(--muted)", fontSize: 12 }}>Files Selected</small>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)", marginTop: 4 }}>
              {workspace.documents.length}
            </div>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{workspace.documents.length} total inputs</span>
          </div>
        </div>

        <div className="board-grid" style={{ marginTop: 18 }}>
          <article>
            <h3>Executive Summary</h3>
            <p>
              {workspace.name} shows measurable growth with active watch areas in working capital, leakage exposure, and
              data quality. The next finance review should prioritize recoverable leakage and forecast sensitivity.
            </p>
          </article>
          <article>
            <h3>Key Risks</h3>
            <p>Margin pressure, receivable conversion, data warnings, and high-confidence exception findings need review.</p>
          </article>
          <article>
            <h3>Forecast Outlook</h3>
            <p>Near-term revenue remains positive in the demo model, but working-capital timing can materially affect cash visibility.</p>
          </article>
          <article>
            <h3>Immediate Actions</h3>
            <p>Review high-severity findings, validate warning files, and run pricing, collections, and hiring scenarios.</p>
          </article>
        </div>
      </section>
    </>
  );
}

export function WorkspaceExperience({ workspace }: { workspace: DemoWorkspace }) {
  const [activeTab, setActiveTab] = useState<Tab>("Financial Analysis");
  const [selectedDocs, setSelectedDocs] = useState(() => new Set(workspace.documents.map((doc) => doc.id)));
  const metrics = computeMetrics(workspace.financials);
  const health = computeFinanceHealth(metrics);
  const groupedDocs = groupDocuments(workspace.documents);
  const leakage = workspace.findings.reduce((total, finding) => total + finding.estimatedValue, 0);
  const warnings = workspace.documents.reduce((total, doc) => total + doc.warnings.length, 0);

  const toggleDoc = (id: string) => {
    setSelectedDocs((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="workspace-layout">
      <aside className="workspace-sidebar">
        <div>
          <Pill status="amber">Confidential demo snapshot</Pill>
          <h1>{workspace.name}</h1>
          <p>{workspace.narrative}</p>
        </div>

        {Object.entries(groupedDocs).map(([group, docs]) => (
          <div className="doc-group" key={group}>
            <h2>{group}</h2>
            {docs.map((doc) => (
              <label className="doc-row" key={doc.id}>
                <input checked={selectedDocs.has(doc.id)} onChange={() => toggleDoc(doc.id)} type="checkbox" />
                <span>
                  <strong>
                    <FileSpreadsheet size={14} /> {doc.name}
                  </strong>
                  <small>
                    {doc.mappingStatus} · {doc.healthScore}% health · {doc.rows.toLocaleString("en-IN")} rows
                  </small>
                  {doc.warnings[0] ? (
                    <em>
                      <AlertTriangle size={13} /> {doc.warnings[0]}
                    </em>
                  ) : (
                    <em>
                      <CheckCircle2 size={13} /> No blocking warnings
                    </em>
                  )}
                </span>
                <a aria-label={`Download ${doc.name}`} href={doc.filePath} onClick={(event) => event.stopPropagation()}>
                  <Download size={15} />
                </a>
              </label>
            ))}
          </div>
        ))}
      </aside>

      <section className="workspace-main">
        <div className="status-band">
          <div>
            <small>Finance Health</small>
            <strong>{health}/100</strong>
            <Pill status={health >= 75 ? "green" : health >= 55 ? "amber" : "red"}>{health >= 75 ? "Stable" : "Watch"}</Pill>
          </div>
          <div>
            <small>Leakage Exposure</small>
            <strong>{formatInr(leakage)}</strong>
            <Pill status="amber">Recoverable</Pill>
          </div>
          <div>
            <small>Files Selected</small>
            <strong>
              {selectedDocs.size}/{workspace.documents.length}
            </strong>
            <Pill status="green">All on by default</Pill>
          </div>
          <div>
            <small>Data Warnings</small>
            <strong>{warnings}</strong>
            <Pill status={warnings > 0 ? "amber" : "green"}>{warnings > 0 ? "Needs review" : "Clean"}</Pill>
          </div>
        </div>

        <nav className="tab-nav" aria-label="Workspace tabs">
          {tabs.map((tab) => (
            <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Financial Analysis" ? <FinancialAnalysis workspace={workspace} /> : null}
        {activeTab === "Revenue Leaks" ? <RevenueLeaks workspace={workspace} /> : null}
        {activeTab === "Forecasting" ? <Forecasting workspace={workspace} /> : null}
        {activeTab === "Modeling" ? <Modeling workspace={workspace} /> : null}
        {activeTab === "Budgeting" ? <Budgeting workspace={workspace} /> : null}
        {activeTab === "Audit Trail" ? <AuditTrail workspace={workspace} /> : null}
        {activeTab === "Board Summary" ? <BoardSummary workspace={workspace} /> : null}

        <div className="privacy-note">
          <ShieldCheck size={17} />
          <span>Deterministic metrics are computed locally from normalized demo contracts. AI narrative receives only masked KPI states.</span>
          <LineChart size={17} />
          <Bot size={17} />
        </div>
      </section>
    </div>
  );
}
