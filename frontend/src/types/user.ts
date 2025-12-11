export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash?: string;
  createdAt?: string;
}
