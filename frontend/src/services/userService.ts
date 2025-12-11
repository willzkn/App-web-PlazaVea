import { apiClient } from "./apiClient";
import type { User } from "@/types/user";

const normalizeUser = (user: User): User => ({
  ...user,
  phone: user.phone ?? null,
});

export const userService = {
  async getAll(): Promise<User[]> {
    const users = await apiClient.get<User[]>("/users");
    return users.map(normalizeUser);
  },

  async getById(id: number): Promise<User> {
    const user = await apiClient.get<User>(`/users/${id}`);
    return normalizeUser(user);
  },

  async getByEmail(email: string): Promise<User | null> {
    try {
      const user = await apiClient.get<User>(`/users/email/${encodeURIComponent(email)}`);
      return normalizeUser(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes("HTTP 404")) {
        return null;
      }
      throw error;
    }
  },

  async create(payload: Omit<User, "id" | "createdAt"> & { passwordHash: string }): Promise<User> {
    const user = await apiClient.post<User>("/users", payload);
    return normalizeUser(user);
  },

  async update(id: number, payload: Partial<User>): Promise<User> {
    const user = await apiClient.put<User>(`/users/${id}`, payload);
    return normalizeUser(user);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
