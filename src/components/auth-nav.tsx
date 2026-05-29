"use client";

import { OrganizationSwitcher, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function AuthNav() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="auth-nav auth-nav-loading">
        <a className="button ghost compact" href="/sign-in">
          Sign in
        </a>
        <a className="button primary compact" href="/sign-up">
          Get started <ArrowRight size={15} />
        </a>
      </div>
    );
  }

  return (
    <div className="auth-nav">
      {isSignedIn ? (
        <>
          <a className="button ghost compact" href="/demo">
            Workspace
          </a>
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/demo"
            afterLeaveOrganizationUrl="/onboarding"
            afterSelectOrganizationUrl="/demo"
            hidePersonal
          />
          <UserButton />
        </>
      ) : (
        <>
          <SignInButton mode="redirect" fallbackRedirectUrl="/demo">
            <button className="button ghost compact" type="button">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
            <button className="button primary compact" type="button">
              Get started <ArrowRight size={15} />
            </button>
          </SignUpButton>
        </>
      )}
    </div>
  );
}
