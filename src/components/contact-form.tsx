"use client";

import { FormEvent, useState } from "react";
import type { ContactEntry } from "@/lib/content/types";

export function ContactForm({ contacts }: { contacts: ContactEntry[] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("ok");
      setMessage("Thank you — we received your message and will follow up soon.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not send message. Please call us instead.",
      );
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <ul className="space-y-5">
          {contacts.map((entry) => (
            <li key={entry.id}>
              <p className="text-xs uppercase tracking-[0.16em] text-accent">
                {entry.label}
              </p>
              {entry.href ? (
                <a
                  href={entry.href}
                  className="mt-1 block text-lg text-cream transition hover:text-accent"
                >
                  {entry.value}
                </a>
              ) : (
                <p className="mt-1 text-lg text-cream">{entry.value}</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 border border-line bg-surface/50 p-6 md:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted">Name</span>
            <input
              required
              name="name"
              className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Phone</span>
            <input
              name="phone"
              className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none transition focus:border-accent"
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-muted">Email</span>
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Message</span>
          <textarea
            required
            name="message"
            rows={5}
            className="mt-2 w-full border border-line bg-background px-3 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-deep disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
        {message ? (
          <p
            className={`text-sm ${
              status === "error" ? "text-red-300" : "text-cream"
            }`}
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
