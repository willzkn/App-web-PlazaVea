import { apiClient } from "./apiClient";
import type { Order, OrderPayload } from "@/types/order";

export const orderService = {
  async getAll(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders");
  },

  async create(payload: OrderPayload): Promise<Order> {
    return apiClient.post<Order>("/orders", payload);
  },

  async updateStatus(id: number, status: string): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}/status?status=${encodeURIComponent(status)}`, {});
  },
};
