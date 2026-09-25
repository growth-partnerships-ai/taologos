"use client";

type Props = {
  active: boolean;
  onClick: () => void;
};

/** Decision 14+17C: between-section inserter; popover opens from parent on click. */
export function SectionInserter({ active, onClick }: Props) {
  return (
    <div className="group relative z-10 -my-1 flex h-8 items-center justify-center">
      <div
        className={`absolute inset-x-8 h-px transition ${
          active
            ? "bg-accent shadow-[0_0_12px_rgba(240,120,24,0.8)]"
            : "bg-line group-hover:bg-accent/70 group-hover:shadow-[0_0_10px_rgba(240,120,24,0.45)]"
        }`}
      />
      <button
        type="button"
        aria-label="Add section here"
        onClick={onClick}
        className={`relative flex h-8 w-8 items-center justify-center rounded-full border text-lg leading-none transition ${
          active
            ? "border-accent bg-accent text-background shadow-[0_0_16px_rgba(240,120,24,0.7)]"
            : "border-line bg-surface text-cream group-hover:border-accent group-hover:text-accent"
        }`}
      >
        +
      </button>
    </div>
  );
}
