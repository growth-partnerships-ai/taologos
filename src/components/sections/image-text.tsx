import type { ImageTextData } from "@/lib/content/types";

export function ImageText({ content }: { content: ImageTextData }) {
  const imageFirst = content.imagePosition !== "right";

  return (
    <section className="section-pad border-t border-line">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 ${
          imageFirst ? "" : ""
        }`}
      >
        <div className={imageFirst ? "order-1" : "order-1 lg:order-2"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.image}
            alt=""
            className="aspect-[4/3] w-full border border-line object-cover"
          />
        </div>
        <div className={imageFirst ? "order-2" : "order-2 lg:order-1"}>
          {content.eyebrow ? <p className="eyebrow">{content.eyebrow}</p> : null}
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted whitespace-pre-wrap">
            {content.body}
          </p>
        </div>
      </div>
    </section>
  );
}
