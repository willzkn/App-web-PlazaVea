import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Receipt } from "@/types/product";
import { toast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  receipts: Receipt[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  checkout: (paymentMethod: string) => Receipt;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("plaza-cart");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as CartItem[];
      return parsed.map((item) => ({ ...item, id: Number(item.id) }));
    } catch (error) {
      console.error("Error parsing cart from storage", error);
      return [];
    }
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem("plaza-receipts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("plaza-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("plaza-receipts", JSON.stringify(receipts));
  }, [receipts]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.originalPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getDiscount = () => {
    return items.reduce((total, item) => {
      if (item.originalPrice) {
        return total + (item.originalPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const checkout = (paymentMethod: string): Receipt => {
    const receipt: Receipt = {
      id: `BOL-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...items],
      subtotal: getSubtotal(),
      discount: getDiscount(),
      total: getCartTotal(),
      paymentMethod,
      status: "completed",
    };
    setReceipts((prev) => [receipt, ...prev]);
    clearCart();
    return receipt;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        receipts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getSubtotal,
        getDiscount,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
