import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function Header() {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-plaza-lg">
      {/* Top bar */}
      <div className="bg-plaza-red-dark">
        <div className="plaza-container py-1.5">
          <p className="text-center text-xs text-primary-foreground/90 font-medium">
            🚚 Envío gratis en compras mayores a S/100 | 📞 Atención: 0800-123-456
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="plaza-container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-primary font-heading font-bold text-xl">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-primary-foreground font-heading font-bold text-xl leading-none">
                Plaza Vea
              </h1>
              <p className="text-primary-foreground/80 text-xs">Tu compra, tu ahorro</p>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="¿Qué estás buscando hoy?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 rounded-full bg-primary-foreground border-0 focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/boletas" className="hidden sm:flex">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <FileText className="h-5 w-5" />
                <span className="hidden lg:inline ml-2">Mis Boletas</span>
              </Button>
            </Link>

            <Link to="/carrito" className="relative">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-cart-bounce">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 rounded-full bg-primary-foreground border-0"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden bg-primary border-t border-primary-foreground/10 overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-48" : "max-h-0"
        )}
      >
        <nav className="plaza-container py-4 space-y-2">
          <Link
            to="/"
            className="block text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/boletas"
            className="block text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Mis Boletas
          </Link>
          <Link
            to="/carrito"
            className="block text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Carrito ({cartCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}
