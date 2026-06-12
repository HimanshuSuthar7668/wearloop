import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateRentalDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getRentalPrice(
  prices: { perDay: number; per3Days: number; perWeek: number },
  days: number
): number {
  if (days >= 7) return prices.perWeek * Math.ceil(days / 7);
  if (days >= 3) return prices.per3Days * Math.ceil(days / 3);
  return prices.perDay * days;
}

export function getSavingsPercentage(rentalPrice: number, retailPrice: number): number {
  return Math.round(((retailPrice - rentalPrice) / retailPrice) * 100);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("wearloop_token");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("wearloop_token", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("wearloop_token");
}
