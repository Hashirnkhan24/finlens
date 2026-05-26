import { describe, expect, it } from "vitest";
import { demoWorkspaces } from "./demo-data";
import { buildInsightBlueprint, computeMetrics } from "./finance";

describe("computeMetrics", () => {
  it("computes the core MVP metrics for every demo workspace", () => {
    for (const workspace of demoWorkspaces) {
      const metrics = computeMetrics(workspace.financials);

      expect(metrics.length).toBeGreaterThanOrEqual(20);
      expect(metrics.find((metric) => metric.id === "current-ratio")).toBeDefined();
      expect(metrics.every((metric) => metric.lineageRefs.length > 0)).toBe(true);
    }
  });

  it("keeps SaaS net margin in a risk state because the demo is loss-making", () => {
    const workspace = demoWorkspaces.find((item) => item.id === "saas");
    expect(workspace).toBeDefined();

    const netMargin = computeMetrics(workspace!.financials).find((metric) => metric.id === "net-margin");
    expect(netMargin?.status).toBe("red");
  });
});

describe("buildInsightBlueprint", () => {
  it("does not include raw transaction or identity fields in the LLM payload", () => {
    const blueprint = buildInsightBlueprint(demoWorkspaces[0]);
    const serialized = JSON.stringify(blueprint).toLowerCase();

    expect(blueprint.privacyBoundary).toBe("masked-kpi-blueprint");
    expect(serialized).not.toContain("invoice amount");
    expect(serialized).not.toContain("customer name");
    expect(blueprint.neverIncluded).toContain("raw rupee transaction rows");
    expect(blueprint.neverIncluded).toContain("customer or vendor legal names");
  });
});
