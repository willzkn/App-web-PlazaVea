import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanner } from "@/components/PromoBanner";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchQuery = searchParams.get("search") || "";

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
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

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No se encontraron productos
                </p>
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
