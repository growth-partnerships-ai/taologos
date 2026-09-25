import type { ClientsMarqueeData } from "@/lib/content/types";

export function ClientsMarquee({ content }: { content: ClientsMarqueeData }) {
  const logos = content.logos.filter((logo) => logo.image);
  if (!logos.length) return null;

  const track = [...logos, ...logos];
  const anim =
    content.direction === "ltr" ? "marquee-ltr" : "marquee-rtl";

  return (
    <section className="section-pad border-t border-line overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {(content.eyebrow || content.title) && (
          <div className="mb-10 max-w-2xl">
            {content.eyebrow ? (
              <p className="eyebrow">{content.eyebrow}</p>
            ) : null}
            {content.title ? (
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
                {content.title}
              </h2>
            ) : null}
          </div>
        )}
        <div className="relative">
          <div className={`flex w-max gap-10 ${anim}`}>
            {track.map((logo, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${logo.id}-${index}`}
                src={logo.image}
                alt=""
                className="h-12 w-auto object-contain opacity-80"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
