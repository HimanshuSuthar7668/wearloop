"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { mockProducts as initialMockProducts } from "@/lib/mockData";
import { productsApi, cartApi, favouritesApi } from "@/lib/api";
import { getAuthToken } from "@/lib/utils";

export interface CartItem {
  productId: string;
  size: string;
  days: number;
}

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  favourites: string[]; // array of productIds
  addToCart: (productId: string, size: string, days: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  addToFavourites: (productId: string) => Promise<boolean>;
  removeFromFavourites: (productId: string) => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "rating" | "reviewCount" | "available">) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Initialize products, cart, and favourites from backend on mount
  useEffect(() => {
    const initApp = async () => {
      // 1. Fetch products
      let activeProducts = initialMockProducts;
      try {
        const prodData = await productsApi.getAll();
        if (prodData && prodData.length > 0) {
          activeProducts = prodData;
        }
      } catch (err) {
        console.error("Failed to load products from backend API, using mock data fallback:", err);
      }
      setProducts(activeProducts);

      // 2. Fetch cart and favourites if authorized
      const token = getAuthToken();
      let activeCart: CartItem[] = [];
      let activeFavourites: string[] = [];

      if (token) {
        try {
          const backendCart = await cartApi.getAll(token);
          if (backendCart && Array.isArray(backendCart)) {
            activeCart = backendCart.map((item) => ({
              productId: String(item.product_id),
              size: "M",
              days: 3,
            }));
          }
        } catch (err) {
          console.error("Failed to load cart from backend API:", err);
        }

        try {
          const backendFavourites = await favouritesApi.getAll(token);
          if (backendFavourites && Array.isArray(backendFavourites)) {
            activeFavourites = backendFavourites.map((item) => String(item.product_id));
          }
        } catch (err) {
          console.error("Failed to load favourites from backend API:", err);
        }
      }

      setCart(activeCart);
      setFavourites(activeFavourites);
      setLoaded(true);
    };

    initApp();
  }, []);

  const addToCart = async (productId: string, size: string, days: number): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;

    const alreadyExists = cart.some((item) => item.productId === productId);
    if (alreadyExists) return false;

    const newCart = [...cart, { productId, size, days }];
    setCart(newCart);

    try {
      await cartApi.addToCart(Number(productId), token);
    } catch (err) {
      console.error("Failed to add to backend cart:", err);
    }
    return true;
  };

  const removeFromCart = async (productId: string) => {
    const token = getAuthToken();
    const newCart = cart.filter((item) => item.productId !== productId);
    setCart(newCart);

    if (token) {
      try {
        await cartApi.removeFromCart(Number(productId), token);
      } catch (err) {
        console.error("Failed to remove from backend cart:", err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    const token = getAuthToken();
    if (token) {
      try {
        await cartApi.clearCart(token);
      } catch (err) {
        console.error("Failed to clear backend cart:", err);
      }
    }
  };

  const addToFavourites = async (productId: string): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;

    const alreadyExists = favourites.includes(productId);
    if (alreadyExists) return false;

    setFavourites([...favourites, productId]);

    try {
      await favouritesApi.add(Number(productId), token);
    } catch (err) {
      console.error("Failed to add to backend favourites:", err);
    }
    return true;
  };

  const removeFromFavourites = async (productId: string) => {
    const token = getAuthToken();
    setFavourites(favourites.filter((id) => id !== productId));

    if (token) {
      try {
        await favouritesApi.remove(Number(productId), token);
      } catch (err) {
        console.error("Failed to remove from backend favourites:", err);
      }
    }
  };

  const addProduct = (newProdData: Omit<Product, "id" | "rating" | "reviewCount" | "available">) => {
    const newId = String(
      products.length > 0
        ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1
        : 1
    );
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      rating: 5.0,
      reviewCount: 0,
      available: true,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    removeFromCart(id);
    removeFromFavourites(id);
  };

  return (
    <AppContext.Provider
      value={{
        products: loaded ? products : initialMockProducts,
        cart,
        favourites,
        addToCart,
        removeFromCart,
        clearCart,
        addToFavourites,
        removeFromFavourites,
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

