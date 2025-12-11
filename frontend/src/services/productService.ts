import { apiClient } from "./apiClient";
import type { Product, ProductApi, ProductPayload } from "@/types/product";

const mapApiToProduct = (apiProduct: ProductApi): Product => {
  const discountCents = apiProduct.discountCents ?? 0;
  const priceCents = apiProduct.priceCents ?? 0;
  const finalPrice = priceCents / 100;
  const originalPrice = discountCents > 0 ? (priceCents + discountCents) / 100 : undefined;
  const discountPercent = discountCents > 0 ? Math.round((discountCents / (priceCents + discountCents)) * 100) : undefined;

  return {
    id: apiProduct.id,
    sku: apiProduct.sku,
    name: apiProduct.name,
    description: apiProduct.description,
    price: Number(finalPrice.toFixed(2)),
    originalPrice,
    image: apiProduct.imageUrl,
    categoryId: apiProduct.category?.id ?? null,
    categoryName: apiProduct.category?.name ?? null,
    categorySlug: apiProduct.category?.name
      ? apiProduct.category.name.toLowerCase().replace(/\s+/g, "-")
      : null,
    stock: apiProduct.inventory,
    inventory: apiProduct.inventory,
    priceCents: apiProduct.priceCents,
    discountCents: apiProduct.discountCents,
    createdAt: apiProduct.createdAt,
    unit: "und",
  };
};

const mapProductToPayload = (product: ProductPayload): ProductPayload => {
  const category = product.category
    ? { id: product.category.id }
    : product.categoryId != null
    ? { id: product.categoryId }
    : null;

  return {
    ...product,
    discountCents: product.discountCents ?? 0,
    category,
    categoryId: product.categoryId ?? null,
  };
};

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ProductApi[]>("/products");
    return response.map(mapApiToProduct);
  },
  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<ProductApi>(`/products/${id}`);
    return mapApiToProduct(response);
  },
  async create(product: ProductPayload): Promise<Product> {
    const response = await apiClient.post<ProductApi>("/products", mapProductToPayload(product));
    return mapApiToProduct(response);
  },
  async update(id: number, product: ProductPayload): Promise<Product> {
    const response = await apiClient.put<ProductApi>(`/products/${id}`, mapProductToPayload(product));
    return mapApiToProduct(response);
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
