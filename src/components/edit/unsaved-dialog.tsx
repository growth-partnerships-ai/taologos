"use client";

type Props = {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
};

export function UnsavedChangesDialog({
  open,
  onSave,
  onDiscard,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md border border-line bg-surface p-6 shadow-xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-cream">
          Unsaved changes
        </h2>
        <p className="mt-3 text-sm text-muted">
          You have unsaved changes. Click Save to keep your changes
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-background"
            onClick={onSave}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-sm border border-line px-4 py-2 text-sm text-cream"
            onClick={onDiscard}
          >
            Discard
          </button>
          <button
            type="button"
            className="rounded-sm border border-line px-4 py-2 text-sm text-muted"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
