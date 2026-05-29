import { describe, expect, it } from "vitest";
import { getOnboardingDestination, isOnboardingComplete } from "./onboarding";

describe("onboarding helpers", () => {
  it("treats explicit completion as onboarded", () => {
    expect(isOnboardingComplete({ onboardingComplete: true })).toBe(true);
  });

  it("does not treat missing or false metadata as complete", () => {
    expect(isOnboardingComplete(undefined)).toBe(false);
    expect(isOnboardingComplete({ onboardingComplete: false })).toBe(false);
  });

  it("returns the correct post-auth destination", () => {
    expect(getOnboardingDestination({ onboardingComplete: true })).toBe("/demo");
    expect(getOnboardingDestination({})).toBe("/onboarding");
  });
});
