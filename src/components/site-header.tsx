"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#who-we-are", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader({ brandName }: { brandName: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-background/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-md bg-accent text-[0.65rem] font-bold leading-none text-background"
          >
            <span className="block w-5 space-y-0.5">
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
            </span>
          </span>
          <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-foreground md:text-base">
            {brandName}
            <span className="mt-0.5 block text-[0.65rem] tracking-[0.28em] text-muted">
              GENERAL CONTRACTOR
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-deep"
          >
            Contact us
          </a>
        </nav>
        <a
          href="#contact"
          className="rounded-sm bg-accent px-3 py-2 text-xs font-semibold text-background md:hidden"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
