import type { SiteContent } from "@/lib/content/types";

export function Recognition({
  content,
}: {
  content: SiteContent["recognition"];
}) {
  if (!content.items.length) return null;

  return (
    <section id="recognition" className="section-pad border-t border-line">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-muted">{content.intro}</p>
        </div>

        <div className="mt-14 space-y-12">
          {content.items.map((cert) => (
            <article
              key={cert.id}
              className="grid overflow-hidden border border-line bg-surface/40 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <a
                href={cert.image}
                target="_blank"
                rel="noreferrer"
                className="relative block bg-cream/95 p-4 md:p-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cert.image}
                  alt={`${cert.title} — ${cert.issuer}`}
                  className="h-full w-full object-contain"
                />
              </a>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-xs uppercase tracking-[0.18em] text-accent">
                  {cert.issuer}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-cream">
                  {cert.title}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {content.presentedToLabel}{" "}
                  <span className="text-cream">{cert.recipient}</span>
                </p>
                {cert.projectLabel ? (
                  <p className="mt-4 border-l-2 border-accent pl-4 text-sm text-cream/90">
                    {cert.projectLabel}
                  </p>
                ) : null}
                <p className="mt-5 text-muted leading-relaxed">{cert.summary}</p>
                <ul className="mt-6 space-y-2">
                  {cert.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-muted before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
