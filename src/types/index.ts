export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "dress" | "top" | "bottom" | "outerwear" | "accessory" | "suit";
  occasion: "casual" | "formal" | "party" | "wedding" | "work";
  images: string[];
  rentalPrice: {
    perDay: number;
    per3Days: number;
    perWeek: number;
  };
  retailPrice: number;
  sizes: string[];
  description: string;
  available: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "active" | "returned" | "cancelled";
  size: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  startDate: string;
  endDate: string;
  size: string;
  days: number;
  subtotal: number;
}

export interface AuthForm {
  email: string;
  password: string;
  name?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export type RentalDuration = "1day" | "3days" | "7days";

export interface FilterState {
  category: string;
  occasion: string;
  size: string;
  minPrice: number;
  maxPrice: number;
  sort: "popular" | "price-asc" | "price-desc" | "newest";
}
