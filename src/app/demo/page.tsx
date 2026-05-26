import { ArrowRight, Boxes, Building2, Download, FileSpreadsheet, LineChart, PlayCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { demoWorkspaces } from "@/lib/demo-data";

const industryIcon = {
  manufacturing: Boxes,
  retail: Building2,
  saas: LineChart
};

export default function DemoPage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">FL</span>
          <span>
            FinLens
            <small>Demo Workspaces</small>
          </span>
        </a>
        <div className="topbar-actions">
          <ThemeToggle />
          <a className="button ghost compact" href="/">
            Back to Landing
          </a>
        </div>
      </header>

      <section className="section demo-hero">
        <div className="section-heading">
          <span className="eyebrow">
            <PlayCircle size={16} /> Interactive proof environment
          </span>
          <h1>Choose a finance workspace.</h1>
          <p>
            Each workspace loads all files by default, includes real Excel demo inputs, and opens into workflow tabs for
            analysis, leakage, forecasting, modeling, variance, lineage, and board narrative.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="workspace-card-grid">
          {demoWorkspaces.map((workspace) => {
            const Icon = industryIcon[workspace.id];
            return (
              <article className="workspace-card" key={workspace.id}>
                <div className="workspace-card-top">
                  <Icon size={28} />
                  <span className="risk green">{workspace.fiscalYear}</span>
                </div>
                <h2>{workspace.industry}</h2>
                <p>{workspace.tagline}</p>
                <div className="demo-detail-grid">
                  <div>
                    <strong>{workspace.documents.length}</strong>
                    <span>Excel inputs</span>
                  </div>
                  <div>
                    <strong>{workspace.findings.length}</strong>
                    <span>simulated findings</span>
                  </div>
                  <div>
                    <strong>{workspace.roleFocus.length}</strong>
                    <span>finance roles</span>
                  </div>
                </div>
                <div className="file-chip-list">
                  {workspace.documents.slice(0, 5).map((doc) => (
                    <a href={doc.filePath} key={doc.id}>
                      <FileSpreadsheet size={14} /> {doc.type}
                    </a>
                  ))}
                </div>
                <div className="action-row">
                  <a className="button primary" href={`/demo/${workspace.id}`}>
                    Launch Workspace <ArrowRight size={16} />
                  </a>
                  <a className="button ghost" href={workspace.documents[0].filePath}>
                    <Download size={16} /> Sample File
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
