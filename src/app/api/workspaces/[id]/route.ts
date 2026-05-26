import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/demo-data";
import { buildInsightBlueprint, computeMetrics } from "@/lib/finance";

export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const workspace = getWorkspace(id);

    return NextResponse.json({
      ...workspace,
      metrics: computeMetrics(workspace.financials),
      insightBlueprint: buildInsightBlueprint(workspace)
    });
  });
}
