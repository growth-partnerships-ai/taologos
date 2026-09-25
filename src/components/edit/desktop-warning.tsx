"use client";

/** Decision 21A+C: exact copy, small screens only. */
export function EditDesktopWarning() {
  return (
    <div className="block border-b border-amber-500/40 bg-amber-500/15 px-4 py-2 text-center text-sm text-amber-100 md:hidden">
      For best results, edit this website on a desktop computer.
    </div>
  );
}
