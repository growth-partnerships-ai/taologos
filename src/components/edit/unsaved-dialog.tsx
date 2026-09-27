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
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md border border-line bg-surface p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="unsaved-title"
          className="font-[family-name:var(--font-display)] text-2xl text-cream"
        >
          Unsaved changes
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          You have edits that haven’t been saved yet. Save to keep them, or
          discard to continue without saving.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className="edit-btn rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-background"
            onClick={onSave}
          >
            Save
          </button>
          <button
            type="button"
            className="edit-btn edit-btn-danger-solid rounded-sm px-4 py-2 text-sm font-semibold"
            onClick={onDiscard}
          >
            Discard
          </button>
          <button
            type="button"
            className="edit-btn rounded-sm border border-line px-4 py-2 text-sm text-muted"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
