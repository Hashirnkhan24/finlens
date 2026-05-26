"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import type { BudgetVariance, DemoWorkspace, Financials, Scenario } from "@/lib/types";
import { formatInr } from "@/lib/finance";

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--panel)",
      border: "1px solid var(--line-soft)",
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "var(--shadow)",
      fontSize: 13,
      color: "var(--text)"
    }}>
      <div style={{ fontWeight: 650, marginBottom: 4, color: "var(--faint)" }}>{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ color: entry.color, marginTop: 2 }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </div>
      ))}
    </div>
  );
}

export function WaterfallChart({ financials }: { financials: Financials }) {
  const { revenue, cogs, operatingExpenses, ebitda, netProfit } = financials;
  const grossProfit = revenue - cogs;
  const intTax = ebitda - netProfit;

  const data = [
    { item: "Revenue", base: 0, movement: revenue, fill: "var(--primary)" },
    { item: "COGS", base: revenue, movement: -cogs, fill: "var(--red)" },
    { item: "Gross Profit", base: 0, movement: grossProfit, fill: "var(--green)", isTotal: true },
    { item: "Op. Expenses", base: grossProfit, movement: -operatingExpenses, fill: "var(--red)" },
    { item: "EBITDA", base: 0, movement: ebitda, fill: "var(--green)", isTotal: true },
    { item: "Int. & Tax", base: ebitda, movement: -intTax, fill: "var(--red)" },
    { item: "Net Profit", base: 0, movement: netProfit, fill: "var(--green)", isTotal: true },
  ];

  return (
    <div className="ops-panel">
      <div className="panel-heading">
        <h2>P&L Waterfall</h2>
        <span>Revenue → Net Profit bridge</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 12, right: 16, left: 16, bottom: 4 }} barSize={36}>
          <CartesianGrid stroke="var(--line-soft)" vertical={false} />
          <XAxis dataKey="item" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatInr(v)} />
          <Tooltip content={<ChartTooltip formatter={(v: number) => formatInr(v)} />} />
          <Bar dataKey="base" stackId="s" fill="transparent" />
          <Bar dataKey="movement" stackId="s" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isTotal ? "var(--primary)" : entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ workspace }: { workspace: DemoWorkspace }) {
  const totalLeak = workspace.findings.reduce((s, f) => s + f.estimatedValue, 0);
  const categories = [
    { name: "Pricing Leakage", value: Math.max(totalLeak * 0.3, 1) },
    { name: "Collections Leakage", value: Math.max(totalLeak * 0.25, 1) },
    { name: "AP Leakage", value: Math.max(totalLeak * 0.18, 1) },
    { name: "Inventory Leakage", value: Math.max(totalLeak * 0.12, 1) },
    { name: "Payroll Leakage", value: Math.max(totalLeak * 0.1, 1) },
    { name: "Tax Leakage", value: Math.max(totalLeak * 0.05, 1) },
  ];
  const colors = ["var(--red)", "var(--amber)", "var(--primary)", "var(--teal)", "var(--brand-blue-2)", "var(--green)"];

  return (
    <div className="ops-panel">
      <div className="panel-heading">
        <h2>Leakage by Category</h2>
        <span>₹ at risk</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <ResponsiveContainer width="60%" height={220} minWidth={200}>
          <PieChart>
            <Pie data={categories} cx="50%" cy="50%" innerRadius={52} outerRadius={86} dataKey="value" paddingAngle={2}>
              {categories.map((_, i) => (
                <Cell key={i} fill={colors[i]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={(v: number) => formatInr(v)} />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
          {categories.map((cat, i) => (
            <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: colors[i] }} />
              <span style={{ color: "var(--muted)" }}>{cat.name}</span>
              <span style={{ fontWeight: 600, marginLeft: "auto" }}>{formatInr(cat.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ForecastLineChart({ workspace }: { workspace: DemoWorkspace }) {
  const data = workspace.forecast.map((p) => ({
    period: p.period,
    Actual: p.actual ?? null,
    Forecast: p.forecast,
  }));

  const actualData = data.filter(d => d.Actual !== null);

  return (
    <div className="ops-panel">
      <div className="panel-heading">
        <h2>Forecast Trend</h2>
        <span>Actuals → Projected</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 12, right: 16, left: 16, bottom: 4 }}>
          <CartesianGrid stroke="var(--line-soft)" vertical={false} />
          <XAxis dataKey="period" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatInr(v)} />
          <Tooltip content={<ChartTooltip formatter={(v: number) => formatInr(v)} />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
          <Line type="monotone" dataKey="Actual" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--primary)" }} connectNulls />
          <Line type="monotone" dataKey="Forecast" stroke="var(--amber)" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: "var(--amber)" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScenarioBarChart({ scenarios }: { scenarios: Scenario[] }) {

  const data = [
    { metric: "EBITDA Impact", ...Object.fromEntries(scenarios.map(s => [s.name, s.ebitdaImpact])) },
    { metric: "Runway (mo)", ...Object.fromEntries(scenarios.map(s => [s.name, s.runwayImpactMonths])) },
    { metric: "Margin Δ (bp)", ...Object.fromEntries(scenarios.map(s => [s.name, s.marginImpact * 10000])) },
  ];

  const colors = ["var(--primary)", "var(--green)", "var(--amber)"];

  return (
    <div className="ops-panel">
      <div className="panel-heading">
        <h2>Scenario Comparison</h2>
        <span>Base · Upside · Downside</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 12, right: 16, left: 16, bottom: 4 }} barSize={28}>
          <CartesianGrid stroke="var(--line-soft)" vertical={false} />
          <XAxis dataKey="metric" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(v: number) => typeof v === "number" && Math.abs(v) > 1000 ? formatInr(v) : v.toFixed(2)} />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
          {scenarios.map((s, i) => (
            <Bar key={s.id} dataKey={s.name} fill={colors[i]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VarianceBarChart({ rows }: { rows: BudgetVariance[] }) {
  const data = rows.map(r => ({
    department: r.department.split(" ")[0],
    Budget: r.budget,
    Actual: r.actual,
  }));

  return (
    <div className="ops-panel">
      <div className="panel-heading">
        <h2>Budget vs Actual</h2>
        <span>By department</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 4 }} barSize={18}>
          <CartesianGrid stroke="var(--line-soft)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatInr(v)} />
          <YAxis type="category" dataKey="department" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
          <Tooltip content={<ChartTooltip formatter={(v: number) => formatInr(v)} />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
          <Bar dataKey="Budget" fill="var(--line)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="Actual" fill="var(--primary)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashRunwayAreaChart({ workspace }: { workspace: DemoWorkspace }) {
  const { cash, operatingCashFlow } = workspace.financials;
  const monthlyBurn = operatingCashFlow < 0 ? Math.abs(operatingCashFlow) / 3 : operatingCashFlow * 0.08;

  const data = [
    { period: "Now", cash },
    { period: "Q1", cash: Math.max(0, cash - monthlyBurn * 3) },
    { period: "Q2", cash: Math.max(0, cash - monthlyBurn * 6) },
    { period: "Q3", cash: Math.max(0, cash - monthlyBurn * 9) },
    { period: "Q4", cash: Math.max(0, cash - monthlyBurn * 12) },
    { period: "Q5", cash: Math.max(0, cash - monthlyBurn * 15) },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 12, right: 16, left: 16, bottom: 4 }}>
        <defs>
          <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--line-soft)" vertical={false} />
        <XAxis dataKey="period" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatInr(v)} />
        <Tooltip content={<ChartTooltip formatter={(v: number) => formatInr(v)} />} />
        <Area type="monotone" dataKey="cash" stroke="var(--primary)" strokeWidth={2.5} fill="url(#cashGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
