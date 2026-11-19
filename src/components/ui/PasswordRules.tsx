import { getPasswordRequirements } from "@/lib/passwordStrength";
import { cn } from "@/lib/utils";

const RULES = [
  { key: "minLength", label: "8 or more characters" },
  { key: "hasUpper", label: "An uppercase letter" },
  { key: "hasLower", label: "A lowercase letter" },
  { key: "hasNumber", label: "A number" },
  { key: "hasSymbol", label: "A symbol, like ! or #" },
] as const;

/** Live checklist under a new-password field. Mirrors the backend policy. */
export default function PasswordRules({ password, id }: { password: string; id?: string }) {
  const met = getPasswordRequirements(password);
  return (
    <ul id={id} className="mt-2 grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-1 text-sm" aria-live="polite">
      {RULES.map(({ key, label }) => (
        <li key={key} className={cn("flex items-center gap-2", met[key] ? "text-sage-ink" : "text-ink/60")}>
          <span aria-hidden className="w-3 text-center">{met[key] ? "✓" : "·"}</span>
          {label}
          <span className="sr-only">{met[key] ? "(done)" : "(not yet)"}</span>
        </li>
      ))}
    </ul>
  );
}
