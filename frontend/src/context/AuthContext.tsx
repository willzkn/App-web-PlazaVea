import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";
import { toast } from "@/hooks/use-toast";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "plazavea-auth-user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const existingUser = await userService.getByEmail(email);
      if (!existingUser) {
        toast({ title: "Usuario no encontrado", variant: "destructive" });
        return false;
      }

      if (existingUser.passwordHash !== password) {
        toast({ title: "Contraseña incorrecta", variant: "destructive" });
        return false;
      }

      setUser(existingUser);
      toast({ title: "Sesión iniciada", description: `Bienvenido, ${existingUser.name}` });
      return true;
    } catch (error) {
      console.error("Error en login", error);
      toast({ title: "Error al iniciar sesión", variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({ title: "Sesión cerrada" });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
       isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
