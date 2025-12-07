import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="bg-card shadow-plaza-sm sticky top-[140px] md:top-[108px] z-40">
      <div className="plaza-container">
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-plaza-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <span>🏠</span>
            <span>Todos</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground shadow-plaza-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
