import type { Role, Sector } from "./types";

export type AccountType = "individual" | "organization";

export type PrimaryGoal =
  | "financial-analysis"
  | "revenue-leaks"
  | "forecasting"
  | "budgeting"
  | "audit-readiness";

export type OnboardingMetadata = {
  onboardingComplete: boolean;
  accountType: AccountType;
  role: Role;
  sector: Sector;
  primaryGoal: PrimaryGoal;
  organizationId?: string;
};

export const accountTypeOptions: Array<{ value: AccountType; label: string; copy: string }> = [
  {
    value: "organization",
    label: "Organization",
    copy: "Create a company workspace for finance teams, leadership, and auditors."
  },
  {
    value: "individual",
    label: "Individual",
    copy: "Use FinLens as a personal finance analysis workspace."
  }
];

export const roleOptions: Role[] = [
  "Org Admin",
  "CFO / Finance Head",
  "Finance Manager",
  "Analyst",
  "Auditor",
  "Viewer"
];

export const sectorOptions: Array<{ value: Sector; label: string }> = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "saas", label: "SaaS / Technology" }
];

export const primaryGoalOptions: Array<{ value: PrimaryGoal; label: string }> = [
  { value: "financial-analysis", label: "Financial analysis" },
  { value: "revenue-leaks", label: "Revenue leak detection" },
  { value: "forecasting", label: "Forecasting" },
  { value: "budgeting", label: "Budgeting and variance" },
  { value: "audit-readiness", label: "Audit readiness" }
];

export function isOnboardingComplete(metadata: unknown): metadata is OnboardingMetadata {
  if (!metadata || typeof metadata !== "object") return false;

  return (metadata as Partial<OnboardingMetadata>).onboardingComplete === true;
}

export function getOnboardingDestination(metadata: unknown) {
  return isOnboardingComplete(metadata) ? "/demo" : "/onboarding";
}
