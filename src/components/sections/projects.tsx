import {
  PROJECT_GROUP_META,
  type ProjectGroup,
  type SiteContent,
} from "@/lib/content/types";

const GROUP_ORDER: ProjectGroup[] = [
  "apartment",
  "residential",
  "interior",
  "institutional",
];

export function Projects({ content }: { content: SiteContent["projects"] }) {
  return (
    <section id="projects" className="section-pad border-t border-line">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="eyebrow">Portfolio</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-muted">{content.intro}</p>
        </div>

        <div className="mt-16 space-y-20">
          {GROUP_ORDER.map((group) => {
            const items = content.items.filter((p) => p.group === group);
            if (!items.length) return null;
            const meta = PROJECT_GROUP_META[group];

            return (
              <div key={group} className={`group-${group}`}>
                <div className="mb-8 flex flex-col gap-2 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--group-accent)] md:text-3xl">
                      {meta.label}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm text-muted">
                      {meta.blurb}
                    </p>
                  </div>
                  <span className="text-sm text-muted">
                    {items.length} project{items.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div
                  className={
                    group === "apartment"
                      ? "grid gap-5 md:grid-cols-2"
                      : group === "residential"
                        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        : group === "interior"
                          ? "grid gap-6 md:grid-cols-[1.2fr_0.8fr]"
                          : "grid gap-6"
                  }
                >
                  {items.map((project, index) => {
                    const featured =
                      project.featured ||
                      (group === "institutional" && index === 0);
                    return (
                      <article
                        key={project.id}
                        className={`overflow-hidden border border-line bg-[color:var(--group-tint)] ${
                          featured && group === "apartment"
                            ? "md:col-span-2 md:grid md:grid-cols-2"
                            : ""
                        } ${
                          featured && group === "institutional"
                            ? "md:grid md:grid-cols-[1.1fr_0.9fr]"
                            : ""
                        }`}
                      >
                        <div
                          className={`relative overflow-hidden ${
                            group === "residential" ? "aspect-[4/3]" : "aspect-[16/11]"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-700 hover:scale-105"
                          />
                          <span className="absolute left-4 top-4 bg-accent px-2 py-1 font-[family-name:var(--font-display)] text-xs text-background">
                            {project.number}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between p-6 md:p-8">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--group-accent)]">
                              {project.client}
                            </p>
                            <h4 className="mt-3 font-[family-name:var(--font-display)] text-xl text-cream md:text-2xl">
                              {project.title}
                            </h4>
                            <dl className="mt-5 space-y-2 text-sm text-muted">
                              <div>
                                <dt className="inline text-foreground/70">
                                  Location:{" "}
                                </dt>
                                <dd className="inline">{project.location}</dd>
                              </div>
                              <div>
                                <dt className="inline text-foreground/70">
                                  Type:{" "}
                                </dt>
                                <dd className="inline">{project.typology}</dd>
                              </div>
                              <div>
                                <dt className="inline text-foreground/70">
                                  Scope:{" "}
                                </dt>
                                <dd className="inline">{project.scope}</dd>
                              </div>
                            </dl>
                          </div>
                          {project.testimonial ? (
                            <blockquote className="mt-8 border-l-2 border-[color:var(--group-accent)] pl-4 text-sm italic leading-relaxed text-cream/90">
                              “{project.testimonial.quote}”
                              <footer className="mt-2 not-italic text-xs tracking-wide text-muted">
                                — {project.testimonial.attribution}
                              </footer>
                            </blockquote>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
