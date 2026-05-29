import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <a className="brand auth-brand" href="/">
        <span className="brand-mark">FL</span>
        <span>
          FinLens
          <small>Welcome back</small>
        </span>
      </a>
      <SignIn
        fallbackRedirectUrl="/demo"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </main>
  );
}
