export function SiteFooter({
  note,
  tagline,
}: {
  note: string;
  tagline: string;
}) {
  return (
    <footer className="border-t border-line px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">{note}</p>
        <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-accent">
          {tagline}
        </p>
      </div>
    </footer>
  );
}
