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

export function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  }
  return null;
}

export function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  return getCookie("wearloop_token");
}

export function setAuthToken(token: string): void {
  setCookie("wearloop_token", token, 1);
  // Backwards compatibility
  if (typeof window !== "undefined") {
    localStorage.setItem("wearloop_token", token);
  }
}

export function removeAuthToken(): void {
  removeCookie("wearloop_token");
  if (typeof window !== "undefined") {
    localStorage.removeItem("wearloop_token");
  }
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function getAuthUser(): AuthUser | null {
  const userStr = getCookie("wearloop_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  setCookie("wearloop_user", JSON.stringify(user), 1);
  if (typeof window !== "undefined") {
    localStorage.setItem("wearloop_user", JSON.stringify(user));
  }
}

export function removeAuthUser(): void {
  removeCookie("wearloop_user");
  if (typeof window !== "undefined") {
    localStorage.removeItem("wearloop_user");
  }
}

