"use client";

import { useCallback, useEffect, useState } from "react";
import { ChangePasswordForm } from "@/components/edit/change-password-form";
import { EditLoginForm } from "@/components/edit/login-form";
import { EditWorkspace } from "@/components/edit/edit-workspace";

type EditUser = {
  email: string;
  role: string;
  mustChangePassword: boolean;
};

export default function EditPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<EditUser | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/edit/ensure-users", {
        method: "POST",
        headers: { "x-edit-bootstrap": "1" },
      });
      const res = await fetch("/api/edit/me");
      const data = (await res.json()) as { user: EditUser | null };
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="text-muted">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-16">
        <EditLoginForm onSuccess={(next) => setUser(next)} />
      </main>
    );
  }

  if (user.mustChangePassword) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-16">
        <ChangePasswordForm
          email={user.email}
          forced
          onSuccess={() => setUser({ ...user, mustChangePassword: false })}
        />
      </main>
    );
  }

  return (
    <EditWorkspace user={user} onSignOut={() => setUser(null)} />
  );
}
