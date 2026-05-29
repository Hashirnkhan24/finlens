"use client";

import { useMemo, useState, useTransition } from "react";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { ArrowRight, Building2, CheckCircle2, LineChart, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./actions";
import {
  accountTypeOptions,
  primaryGoalOptions,
  roleOptions,
  sectorOptions,
  type AccountType,
  type PrimaryGoal
} from "@/lib/onboarding";
import type { Role, Sector } from "@/lib/types";

type FormState = {
  accountType: AccountType;
  organizationName: string;
  role: Role;
  sector: Sector;
  primaryGoal: PrimaryGoal;
};

const initialState: FormState = {
  accountType: "organization",
  organizationName: "",
  role: "Org Admin",
  sector: "manufacturing",
  primaryGoal: "financial-analysis"
};

export function OnboardingFlow() {
  const router = useRouter();
  const { user } = useUser();
  const { createOrganization, isLoaded, setActive } = useOrganizationList();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedAccount = useMemo(
    () => accountTypeOptions.find((option) => option.value === form.accountType),
    [form.accountType]
  );

  const canContinueDetails = form.accountType === "individual" || form.organizationName.trim().length >= 2;

  const updateForm = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setError(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const finish = () => {
    setError(null);

    startTransition(async () => {
      try {
        let organizationId: string | undefined;

        if (form.accountType === "organization") {
          if (!isLoaded || !createOrganization || !setActive) {
            setError("Organization setup is still loading. Try again in a moment.");
            return;
          }

          const organization = await createOrganization({ name: form.organizationName.trim() });
          organizationId = organization.id;
          await setActive({ organization: organization.id });
        }

        await completeOnboarding({
          onboardingComplete: true,
          accountType: form.accountType,
          role: form.role,
          sector: form.sector,
          primaryGoal: form.primaryGoal,
          organizationId
        });

        await user?.reload();
        router.replace("/demo");
        router.refresh();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "We could not finish onboarding. Please try again.");
      }
    });
  };

  return (
    <div className="onboarding-shell">
      <section className="onboarding-panel">
        <div className="onboarding-copy">
          <span className="eyebrow">
            <LineChart size={16} /> Account setup
          </span>
          <h1>Set up your FinLens workspace.</h1>
          <p>
            Choose how you will use FinLens so we can tune the workspace around your finance role, sector, and first
            workflow.
          </p>
        </div>

        <div className="step-track" aria-label="Onboarding progress">
          {[1, 2, 3].map((item) => (
            <span className={step >= item ? "active" : ""} key={item}>
              {item}
            </span>
          ))}
        </div>

        {step === 1 ? (
          <div className="onboarding-step">
            <h2>How are you joining?</h2>
            <div className="choice-grid">
              {accountTypeOptions.map((option) => {
                const Icon = option.value === "organization" ? Building2 : UserRound;
                return (
                  <button
                    className={form.accountType === option.value ? "choice-card active" : "choice-card"}
                    key={option.value}
                    onClick={() => updateForm("accountType", option.value)}
                    type="button"
                  >
                    <Icon size={22} />
                    <strong>{option.label}</strong>
                    <span>{option.copy}</span>
                  </button>
                );
              })}
            </div>
            <div className="action-row">
              <button className="button primary" onClick={() => setStep(2)} type="button">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="onboarding-step">
            <h2>{selectedAccount?.label} profile</h2>
            <div className="form-grid">
              {form.accountType === "organization" ? (
                <label>
                  Organization name
                  <input
                    autoFocus
                    onChange={(event) => updateForm("organizationName", event.target.value)}
                    placeholder="Example: Aarav Components"
                    value={form.organizationName}
                  />
                </label>
              ) : null}
              <label>
                Your role
                <select onChange={(event) => updateForm("role", event.target.value as Role)} value={form.role}>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Sector
                <select onChange={(event) => updateForm("sector", event.target.value as Sector)} value={form.sector}>
                  {sectorOptions.map((sector) => (
                    <option key={sector.value} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                First workflow
                <select
                  onChange={(event) => updateForm("primaryGoal", event.target.value as PrimaryGoal)}
                  value={form.primaryGoal}
                >
                  {primaryGoalOptions.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="action-row">
              <button className="button ghost" onClick={() => setStep(1)} type="button">
                Back
              </button>
              <button className="button primary" disabled={!canContinueDetails} onClick={() => setStep(3)} type="button">
                Review setup <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="onboarding-step">
            <h2>Ready to open your workspace?</h2>
            <div className="review-grid">
              <div>
                <span>Account</span>
                <strong>{selectedAccount?.label}</strong>
              </div>
              {form.accountType === "organization" ? (
                <div>
                  <span>Organization</span>
                  <strong>{form.organizationName.trim()}</strong>
                </div>
              ) : null}
              <div>
                <span>Role</span>
                <strong>{form.role}</strong>
              </div>
              <div>
                <span>Sector</span>
                <strong>{sectorOptions.find((sector) => sector.value === form.sector)?.label}</strong>
              </div>
              <div>
                <span>First workflow</span>
                <strong>{primaryGoalOptions.find((goal) => goal.value === form.primaryGoal)?.label}</strong>
              </div>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="action-row">
              <button className="button ghost" disabled={isPending} onClick={() => setStep(2)} type="button">
                Back
              </button>
              <button className="button primary" disabled={isPending} onClick={finish} type="button">
                {isPending ? "Creating workspace..." : "Open workspace"} <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
