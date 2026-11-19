"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible modal: Escape and backdrop click close it, page scroll is locked,
 * focus moves to the first field and returns to the trigger on close.
 * On phones it opens as a bottom sheet.
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-dialog-close])");
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-ink/40 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "relative w-full max-h-[92vh] overflow-y-auto bg-paper rounded-t-md sm:rounded-sm px-6 pt-6 pb-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md",
        )}
      >
        <button
          type="button"
          data-dialog-close
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-sm text-ink/60 hover:text-ink hover:bg-ink/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2 id={titleId} className="pr-10 font-display text-2xl text-ink">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-1.5 pr-8 text-sm text-ink/70">
            {description}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
