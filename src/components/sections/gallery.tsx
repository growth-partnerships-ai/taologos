"use client";

import { useEffect, useState } from "react";
import type { GalleryData } from "@/lib/content/types";

export function Gallery({ content }: { content: GalleryData }) {
  const images = content.images.filter((img) => img.src);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!content.autoplay || images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [content.autoplay, images.length]);

  if (!images.length) return null;

  const current = images[index] || images[0];

  return (
    <section className="section-pad border-t border-line">
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
        <div className="relative overflow-hidden border border-line bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt || ""}
            className="aspect-[16/9] w-full object-cover"
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-sm border border-line bg-background/80 px-3 py-2 text-cream"
                onClick={() =>
                  setIndex((value) => (value - 1 + images.length) % images.length)
                }
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm border border-line bg-background/80 px-3 py-2 text-cream"
                onClick={() => setIndex((value) => (value + 1) % images.length)}
              >
                ›
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2 w-2 rounded-full ${
                      i === index ? "bg-accent" : "bg-cream/40"
                    }`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
