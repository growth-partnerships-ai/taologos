"use client";

import { FormEvent, useEffect, useState } from "react";

type CmsUserRow = {
  id: string;
  email: string;
  role: string;
  active: boolean;
  mustChangePassword: boolean;
};

export function UsersPanel({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<CmsUserRow[]>([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/edit/users");
    const data = (await res.json()) as { users?: CmsUserRow[]; error?: string };
    if (!res.ok) {
      setError(data.error || "Could not load users");
      return;
    }
    setUsers(data.users || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createUser(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/edit/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "admin" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not create user");
        return;
      }
      setEmail("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(id: string) {
    if (!window.confirm("Reset this user’s password to the default?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/edit/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "resetPassword" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) setError(data.error || "Reset failed");
      else await load();
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    setBusy(true);
    try {
      const res = await fetch("/api/edit/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "setActive", active }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) setError(data.error || "Update failed");
      else await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/50">
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
            Users
          </h2>
          <button
            type="button"
            className="text-xs text-muted"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="text-sm text-muted">
          Superadmin can create admins, reset passwords to the default, and
          deactivate accounts.
        </p>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

        <form onSubmit={createUser} className="mt-6 space-y-3 border border-line p-3">
          <p className="text-xs uppercase tracking-wide text-accent">
            Create admin
          </p>
          <input
            type="email"
            required
            placeholder="name@taologos.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-sm bg-accent px-3 py-2 text-xs font-semibold text-background"
          >
            Create
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {users.map((row) => (
            <li key={row.id} className="border border-line p-3">
              <p className="text-sm text-cream">{row.email}</p>
              <p className="text-xs text-muted">
                {row.role}
                {row.active ? "" : " · inactive"}
                {row.mustChangePassword ? " · must change password" : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-xs text-accent"
                  disabled={busy}
                  onClick={() => void resetPassword(row.id)}
                >
                  Reset password
                </button>
                <button
                  type="button"
                  className="text-xs text-muted"
                  disabled={busy}
                  onClick={() => void toggleActive(row.id, !row.active)}
                >
                  {row.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
