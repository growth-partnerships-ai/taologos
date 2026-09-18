"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";

export function SiteHeader({
  brandName,
  brandSubtitle,
  logo,
  nav,
}: {
  brandName: string;
  brandSubtitle: string;
  logo: string;
  nav: SiteContent["nav"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-background/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="group flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" className="h-10 w-10 object-contain" />
          <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-foreground md:text-base">
            {brandName}
            <span className="mt-0.5 block text-[0.65rem] tracking-[0.28em] text-muted">
              {brandSubtitle}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          ))}
          <a
            href={nav.ctaHref}
            className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            {nav.ctaLabel}
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm border border-line px-3 py-2 text-xs font-semibold text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-background px-5 py-4 md:hidden"
        >
          <ul className="space-y-3">
            {nav.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="block py-2 text-base text-cream"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={nav.ctaHref}
                className="block py-2 text-base text-accent"
                onClick={() => setOpen(false)}
              >
                {nav.ctaLabel}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
