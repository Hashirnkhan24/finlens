import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { demoWorkspaces, getWorkspace } from "@/lib/demo-data";
import { WorkspaceExperience } from "@/components/workspace-experience";

export function generateStaticParams() {
  return demoWorkspaces.map((workspace) => ({ workspace: workspace.id }));
}

export default async function WorkspacePage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace: workspaceId } = await params;

  if (!demoWorkspaces.some((workspace) => workspace.id === workspaceId)) {
    notFound();
  }

  const workspace = getWorkspace(workspaceId);

  return (
    <main className="site-shell workspace-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">FL</span>
          <span>
            FinLens
            <small>{workspace.industry} Workspace</small>
          </span>
        </a>
        <div className="topbar-actions">
          <ThemeToggle />
          <a className="button ghost compact" href="/demo">
            Change Demo
          </a>
        </div>
      </header>
      <WorkspaceExperience workspace={workspace} />
    </main>
  );
}
