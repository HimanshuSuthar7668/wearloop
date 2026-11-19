"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/** Shared look for every text-like control in the app. */
const controlBase =
  "block w-full rounded-sm border border-ink/30 bg-paper text-ink " +
  "placeholder:text-ink/45 transition-colors hover:border-ink/50 " +
  "focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-400";

export type ControlSize = "sm" | "md";
const controlSizes: Record<ControlSize, string> = {
  md: "min-h-[2.75rem] px-3.5 py-2.5 text-[0.95rem]",
  sm: "h-9 px-3 text-sm leading-none",
};

/** Shared look for every text-like control in the app. */
export const controlClass = (size: ControlSize = "md") => cn(controlBase, controlSizes[size]);

export interface ControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

/**
 * Label + control + hint + error, wired together for screen readers.
 * The control is passed as a render function so it receives the right id/aria props:
 *
 *   <Field label="Email" error={errors.email}>
 *     {(p) => <Input {...p} type="email" value={email} onChange={...} />}
 *   </Field>
 */
export function Field({
  label,
  hint,
  error,
  optional,
  action,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  /** Small link or button shown on the right of the label, e.g. "Forgot password?" */
  action?: ReactNode;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {optional && <span className="ml-1.5 font-normal text-ink/60">(optional)</span>}
        </label>
        {action && <div className="text-sm">{action}</div>}
      </div>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-ink/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type SizedProps = { controlSize?: ControlSize };

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & SizedProps>(
  ({ className, controlSize, ...props }, ref) => (
    <input ref={ref} className={cn(controlClass(controlSize), className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 5, ...props }, ref) => (
    <textarea ref={ref} rows={rows} className={cn(controlClass(), "resize-y leading-relaxed", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & SizedProps>(
  ({ className, children, controlSize, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(controlClass(controlSize), "appearance-none cursor-pointer", controlSize === "sm" ? "pr-8" : "pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/60"
      >
        <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  ),
);
Select.displayName = "Select";

/** Password input with a plain-text Show/Hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type">>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(controlClass(), "pr-16", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm px-2 py-1 text-sm text-ink/70 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

/** A row of mutually exclusive options that looks like segmented buttons but is a real radio group. */
export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  error,
  hint,
  action,
  columns,
}: {
  legend: ReactNode;
  name: string;
  value: T | "";
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode; sub?: ReactNode; disabled?: boolean }[];
  error?: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  columns?: number;
}) {
  const id = useId();
  const describedBy = [hint && !error ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset aria-describedby={describedBy}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <legend className="text-sm font-medium text-ink">{legend}</legend>
        {action && <div className="text-sm">{action}</div>}
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-sm border px-2 py-2.5 text-center transition-colors",
              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper",
              value === o.value ? "border-ink bg-ink text-paper" : "border-ink/30 text-ink hover:border-ink/60",
              o.disabled && "cursor-not-allowed opacity-40 line-through hover:border-ink/30",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="text-sm font-medium">{o.label}</span>
            {o.sub && <span className={cn("mt-0.5 text-xs", value === o.value ? "text-paper/75" : "text-ink/60")}>{o.sub}</span>}
          </label>
        ))}
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** After a failed submit, move focus to the first field marked invalid. */
export function focusFirstError(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    form?.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[aria-describedby] input')?.focus();
  });
}
