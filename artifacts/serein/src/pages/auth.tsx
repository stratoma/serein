import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/auth-context";

type AuthMode = "sign-in" | "sign-up" | "reset";

export default function Auth() {
  const {
    user,
    isReady,
    isConfigured,
    missingConfig,
    signIn,
    signUp,
    signInWithGoogle,
    requestPasswordReset,
    signOut,
  } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      if (mode === "reset") {
        await requestPasswordReset(email.trim());
        setStatus("If an account exists for this email, a reset link has been sent.");
      } else if (mode === "sign-up") {
        await signUp(email.trim(), password);
        setStatus("Your account was created. Check your inbox to verify your email.");
      } else {
        await signIn(email.trim(), password);
        setStatus("You are signed in.");
      }
    } catch {
      if (mode === "reset") {
        setStatus("If an account exists for this email, a reset link has been sent.");
      } else if (mode === "sign-up") {
        setError("We could not create an account with those details.");
      } else {
        setError("We could not sign you in with those details.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
      setStatus("You are signed in with Google.");
    } catch {
      setError("We could not complete Google authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-8 pb-24 pt-40 md:px-16">
      <div className="mx-auto grid max-w-5xl gap-14 md:grid-cols-[0.9fr_1fr] md:items-start">
        <section>
          <Link href="/" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 hover:text-primary">
            Back to Serein
          </Link>
          <span className="mt-12 block text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            Customer access
          </span>
          <h1 className="mt-5 font-serif text-5xl leading-none text-primary md:text-7xl">
            Your ritual, remembered.
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-foreground/55">
            Sign in or create an account to keep your Serein details close. Password reset is handled privately and never reveals whether an email is registered.
          </p>
        </section>

        <section className="border-t border-foreground/10 pt-8 md:pt-0">
          {!isReady ? (
            <div className="bg-[#f5efe6] p-8 md:p-10">
              <p className="text-sm text-foreground/55">Checking session...</p>
            </div>
          ) : !isConfigured ? (
            <div className="bg-[#f5efe6] p-8 md:p-10">
              <div className="flex items-center gap-3 text-primary">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.25em]">Configuration needed</p>
              </div>
              <h2 className="mt-7 font-serif text-3xl text-primary">Account access is not available in this build.</h2>
              <p className="mt-5 text-sm leading-7 text-foreground/55">
                Add the account access configuration locally or rebuild from the production environment where it is configured.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-foreground/50">
                {missingConfig.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          ) : user ? (
            <div className="bg-[#f5efe6] p-8 md:p-10">
              <div className="flex items-center gap-3 text-primary">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.25em]">Signed in</p>
              </div>
              <h2 className="mt-7 font-serif text-3xl text-primary">Your session is active.</h2>
              <p className="mt-5 break-words text-sm leading-7 text-foreground/55">
                {user.email ?? "Authenticated customer"}
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-8 w-full bg-primary px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Sign out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#f5efe6] p-8 md:p-10">
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-in");
                    setError("");
                    setStatus("");
                  }}
                  className={`flex-1 border px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    mode === "sign-in"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/15 text-foreground/55 hover:text-primary"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-up");
                    setError("");
                    setStatus("");
                  }}
                  className={`border px-3 py-3 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                    mode === "sign-up"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/15 text-foreground/55 hover:text-primary"
                  }`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("reset");
                    setError("");
                    setStatus("");
                  }}
                  className={`border px-3 py-3 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                    mode === "reset"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/15 text-foreground/55 hover:text-primary"
                  }`}
                >
                  Reset
                </button>
              </div>

              {mode !== "reset" && (
                <>
                  <button
                    type="button"
                    onClick={() => void handleGoogleAuth()}
                    disabled={isSubmitting}
                    className="mt-8 flex w-full items-center justify-center gap-3 border border-foreground/15 bg-background/40 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FcGoogle className="h-4 w-4" />
                    Continue with Google
                  </button>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="h-px flex-1 bg-foreground/10" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">Or use email</span>
                    <span className="h-px flex-1 bg-foreground/10" />
                  </div>
                </>
              )}

              <div className="mt-10">
                <label htmlFor="auth-email" className="text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                  Email
                </label>
                <div className="mt-3 flex items-center border-b border-foreground/15">
                  <Mail className="h-4 w-4 text-foreground/35" strokeWidth={1.5} />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 flex-1 bg-transparent px-4 text-sm text-primary outline-none placeholder:text-foreground/35"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {mode !== "reset" && (
                <div className="mt-8">
                  <label htmlFor="auth-password" className="text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                    Password
                  </label>
                  <div className="mt-3 flex items-center border-b border-foreground/15">
                    <KeyRound className="h-4 w-4 text-foreground/35" strokeWidth={1.5} />
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 flex-1 bg-transparent px-4 text-sm text-primary outline-none placeholder:text-foreground/35"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-foreground/45 transition-colors hover:text-primary"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="mt-6 text-sm text-red-900">{error}</p>}
              {status && <p className="mt-6 text-sm text-foreground/60">{status}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full bg-primary px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Please wait"
                  : mode === "reset"
                    ? "Send reset email"
                    : mode === "sign-up"
                      ? "Create account"
                      : "Sign in"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
