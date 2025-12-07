import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <article className="plaza-card group overflow-hidden animate-slide-up">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isPromo && (
            <span className="plaza-badge-promo">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="plaza-badge-new">
              Nuevo
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.unit}
        </span>
        <h3 className="font-heading font-semibold text-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-heading font-bold text-primary">
            S/{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              S/{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <div className="mt-4">
          {quantity === 0 ? (
            <Button
              variant="plaza"
              className="w-full"
              onClick={() => addToCart(product)}
            >
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-secondary rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-heading font-semibold text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
