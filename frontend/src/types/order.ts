import type { Product } from "@/types/product";
import type { User } from "@/types/user";

export interface OrderItem {
  id: number;
  quantity: number;
  unitPriceCents: number;
  product: Product;
}

export interface Order {
  id: number;
  status: string;
  totalCents: number;
  currency: string;
  paymentProvider?: string | null;
  providerSessionId?: string | null;
  createdAt: string;
  user?: User | null;
  items: OrderItem[];
}

export interface OrderItemPayload {
  productId: number;
  unitPriceCents: number;
  quantity: number;
}

export interface OrderPayload {
  user: { id: number };
  totalCents: number;
  currency: string;
  paymentProvider?: string | null;
  items: OrderItemPayload[];
}
