import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthNav } from "@/components/auth-nav";
import { demoWorkspaces, getWorkspace } from "@/lib/demo-data";
import { WorkspaceExperience } from "@/components/workspace-experience";
import { isOnboardingComplete } from "@/lib/onboarding";

export function generateStaticParams() {
  return demoWorkspaces.map((workspace) => ({ workspace: workspace.id }));
}

export default async function WorkspacePage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace: workspaceId } = await params;
  const user = await currentUser();

  if (!isOnboardingComplete(user?.publicMetadata)) {
    redirect("/onboarding" as never);
  }

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
          <AuthNav />
          <a className="button ghost compact" href="/demo">
            Change Demo
          </a>
        </div>
      </header>
      <WorkspaceExperience workspace={workspace} />
    </main>
  );
}
