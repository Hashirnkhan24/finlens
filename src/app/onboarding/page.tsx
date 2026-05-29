import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "./onboarding-flow";
import { isOnboardingComplete } from "@/lib/onboarding";

export default async function OnboardingPage() {
  const user = await currentUser();

  if (isOnboardingComplete(user?.publicMetadata)) {
    redirect("/demo" as never);
  }

  return <OnboardingFlow />;
}
