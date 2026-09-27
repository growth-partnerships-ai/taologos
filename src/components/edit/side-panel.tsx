"use client";

import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  /** Decision 11A: full-screen sheet on small screens; 10B: ~400px on desktop */
};

export function EditSidePanel({
  open,
  title,
  children,
  onClose,
  footer,
}: Props) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        className="edit-btn fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />
      <aside
        className="fixed inset-0 z-50 flex flex-col border-line bg-surface md:inset-y-0 md:right-0 md:left-auto md:w-[400px] md:border-l"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-cream">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="edit-btn rounded-sm border border-line px-2 py-1 text-xs text-cream"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-line px-4 py-3">{footer}</div>
        ) : null}
      </aside>
    </>
  );
}
