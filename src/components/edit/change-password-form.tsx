"use client";

import { FormEvent, useState } from "react";
import { MIN_PASSWORD_LENGTH } from "@/lib/edit-auth-public";

type Props = {
  email: string;
  forced: boolean;
  onSuccess: () => void;
};

export function ChangePasswordForm({ email, forced, onSuccess }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/edit/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: forced ? undefined : currentPassword,
          newPassword,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not change password.");
        return;
      }
      onSuccess();
    } catch {
      setError("Could not change password.");
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
        <p className="eyebrow">Security</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-cream">
          {forced ? "Choose a new password" : "Change password"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Signed in as {email}. Minimum {MIN_PASSWORD_LENGTH} characters. Do not
          reuse the default password.
        </p>
      </div>
      {!forced ? (
        <label className="block text-sm">
          <span className="text-muted">Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none focus:border-accent"
          />
        </label>
      ) : null}
      <label className="block text-sm">
        <span className="text-muted">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none focus:border-accent"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none focus:border-accent"
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="edit-btn w-full rounded-sm bg-accent px-4 py-3 text-sm font-semibold text-background hover:bg-accent-deep disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
