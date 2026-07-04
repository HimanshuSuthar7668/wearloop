export type PasswordStrengthLabel = "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";

export interface PasswordStrength {
  score: number; // 0-4
  label: PasswordStrengthLabel;
}

const LABELS: PasswordStrengthLabel[] = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

/**
 * Mirrors the backend policy (min 8 chars + upper/lower/number/symbol) so the
 * UI can show the same requirements as validation, plus a rough strength
 * score for the visual indicator.
 */
export function getPasswordRequirements(password: string) {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: LABELS[0] };

  const requirements = getPasswordRequirements(password);
  let score = Object.values(requirements).filter(Boolean).length - 1; // 0-4

  if (password.length >= 12) score += 1;
  score = Math.max(0, Math.min(4, score));

  return { score, label: LABELS[score] };
}

export function isPasswordValid(password: string): boolean {
  const r = getPasswordRequirements(password);
  return r.minLength && r.hasUpper && r.hasLower && r.hasNumber && r.hasSymbol;
}
