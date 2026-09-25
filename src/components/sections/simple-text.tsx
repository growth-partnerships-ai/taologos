import type { SimpleTextData } from "@/lib/content/types";

export function SimpleText({ content }: { content: SimpleTextData }) {
  return (
    <section className="section-pad border-t border-line">
      <div className="mx-auto max-w-3xl">
        {content.eyebrow ? <p className="eyebrow">{content.eyebrow}</p> : null}
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
          {content.title}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted whitespace-pre-wrap">
          {content.body}
        </p>
      </div>
    </section>
  );
}
