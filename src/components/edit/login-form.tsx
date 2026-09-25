"use client";

import { FormEvent, useState } from "react";

type LoginProps = {
  onSuccess: (user: {
    email: string;
    role: string;
    mustChangePassword: boolean;
  }) => void;
};

export function EditLoginForm({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/edit/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        error?: string;
        user?: {
          email: string;
          role: string;
          mustChangePassword: boolean;
        };
      };
      if (!res.ok || !data.user) {
        setError(data.error || "Could not sign in.");
        return;
      }
      onSuccess(data.user);
    } catch {
      setError("Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-4 border border-line bg-surface/60 p-8"
    >
      <div>
        <p className="eyebrow">Taologos</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-cream">
          Edit website
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in with your Taologos editor account.
        </p>
      </div>
      <label className="block text-sm">
        <span className="text-muted">Email</span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none focus:border-accent"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none focus:border-accent"
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-accent px-4 py-3 text-sm font-semibold text-background hover:bg-accent-deep disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
