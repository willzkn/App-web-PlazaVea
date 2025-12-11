export interface Product {
  id: number;
  sku?: string | null;
  name: string;
  description?: string | null;
  price: number;
  originalPrice?: number;
  image?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  unit?: string | null;
  stock: number;
  inventory?: number;
  priceCents?: number;
  discountCents?: number;
  isPromo?: boolean;
  isNew?: boolean;
  discountPercent?: number;
  createdAt?: string | null;
}

export interface CategoryApi {
  id: number;
  name: string;
  parentId?: number | null;
}

export interface ProductApi {
  id: number;
  sku?: string | null;
  name: string;
  description?: string | null;
  priceCents: number;
  discountCents: number;
  inventory: number;
  imageUrl?: string | null;
  category?: CategoryApi | null;
  createdAt?: string | null;
}

export interface ProductPayload {
  sku?: string | null;
  name: string;
  description?: string | null;
  priceCents: number;
  discountCents?: number;
  inventory: number;
  imageUrl?: string | null;
  category?: { id: number } | null;
  categoryId?: number | null;
}

export interface ProductFormValues {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  inventory: number;
  imageUrl?: string;
  categoryId?: number | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Receipt {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
}
