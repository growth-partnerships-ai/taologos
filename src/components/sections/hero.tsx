import type { SiteContent } from "@/lib/content/types";

export function Hero({
  content,
  tagline,
}: {
  content: SiteContent["hero"];
  tagline: string;
}) {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.image}
          alt=""
          className="hero-image h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p className="eyebrow reveal">{content.eyebrow}</p>
        <h1 className="reveal mt-5 max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-8xl">
          {tagline}
        </h1>
        <p className="reveal mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {content.supporting}
        </p>
        <div className="reveal mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-deep"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-sm border border-line px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
