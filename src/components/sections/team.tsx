import type { SiteContent } from "@/lib/content/types";

export function Team({ content }: { content: SiteContent["team"] }) {
  if (!content.members.length) return null;

  return (
    <section id="team" className="section-pad border-t border-line">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-muted">{content.intro}</p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.members.map((member) => (
            <li
              key={member.id}
              className="overflow-hidden border border-line bg-surface/40"
            >
              {member.photo ? (
                <div className="aspect-[4/3] overflow-hidden bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-cream">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-accent">
                  {member.role}
                </p>
                {member.bio ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {member.bio}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
