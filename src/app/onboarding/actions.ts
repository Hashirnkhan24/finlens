"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import type { OnboardingMetadata } from "@/lib/onboarding";

export async function completeOnboarding(metadata: OnboardingMetadata) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to complete onboarding.");
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: metadata
  });

  return { ok: true };
}
