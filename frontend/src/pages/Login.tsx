import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(form.email.trim(), form.password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="plaza-container max-w-md w-full">
          <div className="plaza-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="font-heading text-3xl font-bold text-foreground">Iniciar sesión</h1>
              <p className="text-muted-foreground text-sm">
                Ingresa con tu correo y contraseña para administrar tus productos.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Validando..." : "Iniciar sesión"}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              ¿Aún no tienes cuenta? Usa el botón "Regístrate" en la pantalla principal para crear una.
            </p>

            <div className="text-center">
              <Link to="/" className="text-sm text-primary underline">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
