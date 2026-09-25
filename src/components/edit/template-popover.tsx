"use client";

import { SECTION_TEMPLATES, type SectionType } from "@/lib/content/sections";

type Props = {
  open: boolean;
  existingTypes: SectionType[];
  onPick: (type: SectionType) => void;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
};

export function TemplatePopover({
  open,
  existingTypes,
  onPick,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="absolute left-1/2 z-30 mt-2 w-[min(92vw,28rem)] -translate-x-1/2 border border-line bg-surface p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-accent">
          Choose a section
        </p>
        <button
          type="button"
          className="text-xs text-muted"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <ul className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
        {SECTION_TEMPLATES.map((template) => {
          const blocked =
            template.singleton && existingTypes.includes(template.type);
          return (
            <li key={template.type}>
              <button
                type="button"
                disabled={blocked}
                onClick={() => onPick(template.type)}
                className="w-full border border-line bg-background/60 p-3 text-left transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <p className="text-sm font-semibold text-cream">
                  {template.name}
                </p>
                <p className="mt-1 text-xs text-muted">{template.description}</p>
                {blocked ? (
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-accent">
                    Already on page
                  </p>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
