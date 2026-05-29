import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="auth-shell">
      <a className="brand auth-brand" href="/">
        <span className="brand-mark">FL</span>
        <span>
          FinLens
          <small>Create your account</small>
        </span>
      </a>
      <SignUp
        fallbackRedirectUrl="/onboarding"
        forceRedirectUrl="/onboarding"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </main>
  );
}
