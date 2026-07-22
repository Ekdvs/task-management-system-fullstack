"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { getApiErrorMessage } from "@/src/lib/api";


export default function LoginPage() {
  const { login, isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace("/dashboard");
  }, [isReady, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Signature panel: a little animated task list that "completes itself" */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-strong px-12 py-12 text-white lg:flex">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">Tasklog</p>
          <p className="mt-1 text-sm text-white/60">Koncepthive · Task Management</p>
        </div>

        <div className="space-y-3">
          <SamplePlan
            title="Ship the intern assessment"
            status="done"
          />
          <SamplePlan title="Review pull requests" status="progress" />
          <SamplePlan title="Write API documentation" status="pending" />
          <p className="pt-4 max-w-sm text-sm leading-relaxed text-white/60">
            One place to plan the day, track what&apos;s moving, and catch what&apos;s
            overdue before it becomes a problem.
          </p>
        </div>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} Koncepthive</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-canvas px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="font-display text-2xl font-semibold text-ink">Tasklog</p>
            <p className="text-sm text-ink-muted">Koncepthive · Task Management</p>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Log in to see what needs your attention today.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-overdue-soft px-3 py-2 text-sm text-overdue">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition hover:bg-brand-strong disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-surface-sunken px-3 py-2.5 text-xs text-ink-muted">
            Demo credentials: <span className="font-mono">admin@test.com</span> /{" "}
            <span className="font-mono">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SamplePlan({
  title,
  status,
}: {
  title: string;
  status: "done" | "progress" | "pending";
}) {
  const icon =
    status === "done" ? (
      <CheckCircle2 size={18} className="text-white" />
    ) : status === "progress" ? (
      <Clock3 size={18} className="text-white/70" />
    ) : (
      <Circle size={18} className="text-white/40" />
    );

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
      {icon}
      <span
        className={
          status === "done"
            ? "text-sm text-white/50 line-through"
            : "text-sm text-white/90"
        }
      >
        {title}
      </span>
    </div>
  );
}
