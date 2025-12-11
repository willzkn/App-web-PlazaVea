import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanner } from "@/components/PromoBanner";
import { Footer } from "@/components/Footer";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchQuery = searchParams.get("search")?.toLowerCase() ?? "";

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["products"], queryFn: () => productService.getAll() });

  const categories = useMemo(() => {
    if (!products) return [];
    const map = new Map<string, { id: string; name: string; slug: string; icon?: string }>();
    products.forEach((product) => {
      if (product.categoryName) {
        const slug = product.categorySlug ?? product.categoryName.toLowerCase().replace(/\s+/g, "-");
        if (!map.has(slug)) {
          map.set(slug, {
            id: String(product.categoryId ?? slug),
            name: product.categoryName,
            slug,
            icon: "🛒",
          });
        }
      }
    });
    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesCategory = selectedCategory ? product.categorySlug === selectedCategory : true;
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery) ||
          (product.description ?? "").toLowerCase().includes(searchQuery)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <PromoBanner />

        {/* Products Section */}
        <section className="py-8 md:py-12">
          <div className="plaza-container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  {searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : selectedCategory
                    ? "Productos"
                    : "Productos Destacados"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {filteredProducts.length} productos encontrados
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Cargando productos...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">Error al cargar productos.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta recargar la página en unos minutos.
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No se encontraron productos</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta con otra búsqueda o categoría
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
