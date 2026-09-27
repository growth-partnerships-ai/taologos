"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual treatment for destructive actions */
  danger?: boolean;
};

export type RemoveWithUndoOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  toastMessage: string;
  apply: () => void;
  undo: () => void;
};

type EditActionsValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  removeWithUndo: (options: RemoveWithUndoOptions) => Promise<boolean>;
  showUndoToast: (message: string, onUndo: () => void) => void;
};

const EditActionsContext = createContext<EditActionsValue | null>(null);

const UNDO_MS = 10_000;

export function useEditActions() {
  const value = useContext(EditActionsContext);
  if (!value) {
    throw new Error("useEditActions must be used inside EditActionsProvider");
  }
  return value;
}

type ConfirmState = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

type ToastState = {
  id: number;
  message: string;
  onUndo: () => void;
  remainingMs: number;
};

export function EditActionsProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const toastTickRef = useRef<number | null>(null);
  const toastIdRef = useRef(0);

  const clearToastTimers = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    if (toastTickRef.current) {
      window.clearInterval(toastTickRef.current);
      toastTickRef.current = null;
    }
  }, []);

  const dismissToast = useCallback(() => {
    clearToastTimers();
    setToast(null);
  }, [clearToastTimers]);

  const showUndoToast = useCallback(
    (message: string, onUndo: () => void) => {
      clearToastTimers();
      const id = ++toastIdRef.current;
      setToast({ id, message, onUndo, remainingMs: UNDO_MS });

      const started = Date.now();
      toastTickRef.current = window.setInterval(() => {
        const remaining = Math.max(0, UNDO_MS - (Date.now() - started));
        setToast((current) =>
          current && current.id === id
            ? { ...current, remainingMs: remaining }
            : current,
        );
      }, 200);

      toastTimerRef.current = window.setTimeout(() => {
        dismissToast();
      }, UNDO_MS);
    },
    [clearToastTimers, dismissToast],
  );

  useEffect(() => () => clearToastTimers(), [clearToastTimers]);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const removeWithUndo = useCallback(
    async (options: RemoveWithUndoOptions) => {
      const ok = await confirm({
        title: options.title,
        description: options.description,
        confirmLabel: options.confirmLabel || "Remove",
        cancelLabel: "Keep it",
        danger: true,
      });
      if (!ok) return false;
      options.apply();
      showUndoToast(options.toastMessage, options.undo);
      return true;
    },
    [confirm, showUndoToast],
  );

  const value = useMemo(
    () => ({ confirm, removeWithUndo, showUndoToast }),
    [confirm, removeWithUndo, showUndoToast],
  );

  return (
    <EditActionsContext.Provider value={value}>
      {children}

      {confirmState ? (
        <ConfirmDialog
          title={confirmState.title}
          description={confirmState.description}
          confirmLabel={confirmState.confirmLabel || "Confirm"}
          cancelLabel={confirmState.cancelLabel || "Cancel"}
          danger={confirmState.danger}
          onConfirm={() => {
            confirmState.resolve(true);
            setConfirmState(null);
          }}
          onCancel={() => {
            confirmState.resolve(false);
            setConfirmState(null);
          }}
        />
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4">
          <div
            className="pointer-events-auto flex w-full max-w-lg items-center gap-3 border border-line bg-surface px-4 py-3 shadow-xl"
            role="status"
            aria-live="polite"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm text-cream">{toast.message}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Undo available for {Math.ceil(toast.remainingMs / 1000)}s
              </p>
            </div>
            <button
              type="button"
              className="edit-btn shrink-0 rounded-sm bg-accent px-3 py-1.5 text-xs font-semibold text-background"
              onClick={() => {
                toast.onUndo();
                dismissToast();
              }}
            >
              Undo
            </button>
            <button
              type="button"
              className="edit-btn shrink-0 rounded-sm border border-line px-2 py-1.5 text-xs text-muted"
              aria-label="Dismiss"
              onClick={dismissToast}
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </EditActionsContext.Provider>
  );
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/65 px-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md border border-line bg-surface p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="edit-confirm-title"
        aria-describedby="edit-confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="edit-confirm-title"
          className="font-[family-name:var(--font-display)] text-2xl text-cream"
        >
          {title}
        </h2>
        <p id="edit-confirm-desc" className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            className={`edit-btn rounded-sm px-4 py-2 text-sm font-semibold ${
              danger
                ? "border border-red-400/50 bg-red-500/15 text-red-200 hover:bg-red-500/25"
                : "bg-accent text-background"
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            className="edit-btn rounded-sm border border-line px-4 py-2 text-sm text-cream"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Compact remove control used across list editors */
export function RemoveButton({
  title,
  description,
  toastMessage,
  confirmLabel = "Remove",
  onRemove,
  onUndo,
  children = "Remove",
  className = "edit-btn edit-btn-danger text-xs text-red-300",
}: {
  title: string;
  description: string;
  toastMessage: string;
  confirmLabel?: string;
  onRemove: () => void;
  onUndo: () => void;
  children?: ReactNode;
  className?: string;
}) {
  const { removeWithUndo } = useEditActions();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        void removeWithUndo({
          title,
          description,
          confirmLabel,
          toastMessage,
          apply: onRemove,
          undo: onUndo,
        });
      }}
    >
      {children}
    </button>
  );
}
