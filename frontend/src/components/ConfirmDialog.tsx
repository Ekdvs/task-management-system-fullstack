"use client";

import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-surface p-5 shadow-xl"
      >
        <h2 id="confirm-title" className="font-display text-base font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-sunken"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-lg px-3 py-2 text-sm font-medium text-white transition disabled:opacity-60 ${
              danger ? "bg-overdue hover:bg-overdue/90" : "bg-brand hover:bg-brand-strong"
            }`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
