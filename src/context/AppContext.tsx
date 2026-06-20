"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { mockProducts as initialMockProducts } from "@/lib/mockData";

export interface CartItem {
  productId: string;
  size: string;
  days: number;
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (productId: string, size: string, days: number) => boolean;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Omit<Product, "id" | "rating" | "reviewCount" | "available">) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("wearloop_products");
      if (storedProducts) {
        try {
          setProducts(JSON.parse(storedProducts));
        } catch {
          setProducts(initialMockProducts);
        }
      } else {
        setProducts(initialMockProducts);
        localStorage.setItem("wearloop_products", JSON.stringify(initialMockProducts));
      }

      const storedCart = localStorage.getItem("wearloop_cart");
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch {
          setCart([]);
        }
      }
      setLoaded(true);
    }
  }, []);

  // Save products to local storage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    if (typeof window !== "undefined") {
      localStorage.setItem("wearloop_products", JSON.stringify(newProducts));
    }
  };

  // Save cart to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("wearloop_cart", JSON.stringify(newCart));
    }
  };

  const addToCart = (productId: string, size: string, days: number): boolean => {
    // Same product can't be added again until it's removed
    const alreadyExists = cart.some((item) => item.productId === productId);
    if (alreadyExists) return false;

    const newCart = [...cart, { productId, size, days }];
    saveCart(newCart);
    return true;
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const addProduct = (newProdData: Omit<Product, "id" | "rating" | "reviewCount" | "available">) => {
    const newId = String(
      products.length > 0 
        ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 
        : 1
    );
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      available: true
    };
    saveProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const newProducts = products.map((p) => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((p) => p.id !== id);
    saveProducts(newProducts);
    // Also remove from cart if it was there
    removeFromCart(id);
  };

  return (
    <AppContext.Provider
      value={{
        products: loaded ? products : initialMockProducts,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
