import { NextResponse } from "next/server";
import { demoWorkspaces } from "@/lib/demo-data";
import { buildInsightBlueprint, computeMetrics } from "@/lib/finance";

export function GET() {
  return NextResponse.json(
    demoWorkspaces.map((workspace) => ({
      ...workspace,
      metrics: computeMetrics(workspace.financials),
      insightBlueprint: buildInsightBlueprint(workspace)
    }))
  );
}
