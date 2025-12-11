import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import type { Product, ProductFormValues } from "@/types/product";
import type { ProductPayload } from "@/types/product";
import type { User } from "@/types/user";
import type { Order } from "@/types/order";
import { toast } from "@/hooks/use-toast";

interface UserFormValues {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

const createEmptyProductForm = (): ProductFormValues => ({
  id: undefined,
  sku: "",
  name: "",
  price: 0,
  inventory: 0,
  imageUrl: "",
  categoryId: null,
});

const createEmptyUserForm = (): UserFormValues => ({
  id: undefined,
  name: "",
  email: "",
  phone: "",
  password: "",
});

const toProductFormValues = (product: Product): ProductFormValues => ({
  id: product.id,
  sku: product.sku ?? "",
  name: product.name,
  description: product.description ?? "",
  price: product.price,
  inventory: product.inventory ?? product.stock,
  imageUrl: product.image ?? "",
  categoryId: product.categoryId ?? null,
});

const toProductPayload = (form: ProductFormValues): ProductPayload => ({
  sku: form.sku || null,
  name: form.name,
  description: form.description || null,
  priceCents: Math.round(form.price * 100),
  discountCents: 0,
  inventory: form.inventory,
  imageUrl: form.imageUrl || null,
  category: form.categoryId != null ? { id: form.categoryId } : null,
  categoryId: form.categoryId ?? null,
});

const toUserFormValues = (user: User): UserFormValues => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone ?? "",
  password: "",
});

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"products" | "users" | "orders">("products");
  const [productForm, setProductForm] = useState<ProductFormValues>(createEmptyProductForm);
  const [userForm, setUserForm] = useState<UserFormValues>(createEmptyUserForm);
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({ queryKey: ["products"], queryFn: () => productService.getAll() });

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({ queryKey: ["users"], queryFn: () => userService.getAll() });

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({ queryKey: ["orders"], queryFn: () => orderService.getAll() });

  const createProductMutation = useMutation({
    mutationFn: (payload: ProductPayload) => productService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Producto creado" });
      setProductForm(createEmptyProductForm());
    },
    onError: () => toast({ title: "Error al crear producto", variant: "destructive" }),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductPayload }) =>
      productService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Producto actualizado" });
      setProductForm(createEmptyProductForm());
    },
    onError: () => toast({ title: "Error al actualizar producto", variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Producto eliminado" });
    },
    onError: () => toast({ title: "Error al eliminar producto", variant: "destructive" }),
  });

  const createUserMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; phone?: string | null; passwordHash: string }) =>
      userService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Usuario creado" });
      setUserForm(createEmptyUserForm());
    },
    onError: () => toast({ title: "Error al crear usuario", variant: "destructive" }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<User> & { passwordHash?: string } }) =>
      userService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Usuario actualizado" });
      setUserForm(createEmptyUserForm());
    },
    onError: () => toast({ title: "Error al actualizar usuario", variant: "destructive" }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Usuario eliminado" });
    },
    onError: () => toast({ title: "Error al eliminar usuario", variant: "destructive" }),
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Estado de pedido actualizado" });
    },
    onError: () => toast({ title: "Error al actualizar pedido", variant: "destructive" }),
  });

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productForm.name.trim()) {
      toast({ title: "El nombre es obligatorio", variant: "destructive" });
      return;
    }

    const payload = toProductPayload(productForm);

    if (productForm.id) {
      await updateProductMutation.mutateAsync({ id: productForm.id, payload });
    } else {
      await createProductMutation.mutateAsync(payload);
    }
  };

  const handleUserSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userForm.email.trim() || !userForm.name.trim()) {
      toast({ title: "Nombre y correo son obligatorios", variant: "destructive" });
      return;
    }

    if (!userForm.id && !userForm.password) {
      toast({ title: "La contraseña es obligatoria para crear usuarios", variant: "destructive" });
      return;
    }

    if (userForm.id) {
      const payload: Partial<User> & { passwordHash?: string } = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone ?? null,
      };
      if (userForm.password) {
        payload.passwordHash = userForm.password;
      }
      await updateUserMutation.mutateAsync({ id: userForm.id, payload });
    } else {
      await createUserMutation.mutateAsync({
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone ?? null,
        passwordHash: userForm.password ?? "",
      });
    }
  };

  const resetProductForm = () => setProductForm(createEmptyProductForm());
  const resetUserForm = () => setUserForm(createEmptyUserForm());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="plaza-container space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">Panel de administración</h1>
              <p className="text-muted-foreground">Gestiona productos y usuarios desde un solo lugar.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "products" ? "plaza" : "outline"}
                onClick={() => setActiveTab("products")}
              >
                Productos
              </Button>
              <Button
                variant={activeTab === "users" ? "plaza" : "outline"}
                onClick={() => setActiveTab("users")}
              >
                Usuarios
              </Button>
              <Button
                variant={activeTab === "orders" ? "plaza" : "outline"}
                onClick={() => setActiveTab("orders")}
              >
                Pedidos
              </Button>
            </div>
          </div>

          {activeTab === "products" ? (
            <section className="space-y-8">
              <div className="plaza-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {productForm.id ? "Editar producto" : "Nuevo producto"}
                  </h2>
                  {productForm.id && (
                    <Button variant="outline" onClick={resetProductForm}>
                      Cancelar edición
                    </Button>
                  )}
                </div>
                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleProductSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nombre</Label>
                    <Input
                      id="product-name"
                      value={productForm.name}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-sku">SKU</Label>
                    <Input
                      id="product-sku"
                      value={productForm.sku}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, sku: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Precio (S/)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(event) =>
                        setProductForm((prev) => ({ ...prev, price: Number(event.target.value) || 0 }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-inventory">Inventario</Label>
                    <Input
                      id="product-inventory"
                      type="number"
                      value={productForm.inventory}
                      onChange={(event) =>
                        setProductForm((prev) => ({ ...prev, inventory: Number(event.target.value) || 0 }))
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="product-image">URL de imagen</Label>
                    <Input
                      id="product-image"
                      value={productForm.imageUrl ?? ""}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                      {productForm.id ? "Guardar cambios" : "Crear producto"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="plaza-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">Productos existentes</h2>
                {productsLoading ? (
                  <p className="text-muted-foreground">Cargando productos...</p>
                ) : productsError ? (
                  <p className="text-destructive">Error al cargar productos.</p>
                ) : products.length === 0 ? (
                  <p className="text-muted-foreground">No hay productos registrados.</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku ?? "N/A"} • Precio: S/{product.price.toFixed(2)} • Stock: {product.inventory ?? product.stock}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setProductForm(toProductFormValues(product))}>
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : activeTab === "users" ? (
            <section className="space-y-8">
              <div className="plaza-card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {userForm.id ? "Editar usuario" : "Nuevo usuario"}
                  </h2>
                  {userForm.id && (
                    <Button variant="outline" onClick={resetUserForm}>
                      Cancelar edición
                    </Button>
                  )}
                </div>
                <form className="grid gap-4 md:grid-cols-2" onSubmit={handleUserSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Nombre</Label>
                    <Input
                      id="user-name"
                      value={userForm.name}
                      onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Correo</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userForm.email}
                      onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-phone">Teléfono</Label>
                    <Input
                      id="user-phone"
                      value={userForm.phone ?? ""}
                      onChange={(event) => setUserForm((prev) => ({ ...prev, phone: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Contraseña {userForm.id ? "(opcional)" : ""}</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userForm.password ?? ""}
                      onChange={(event) => setUserForm((prev) => ({ ...prev, password: event.target.value }))}
                      placeholder={userForm.id ? "Dejar en blanco para mantener" : undefined}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={createUserMutation.isPending || updateUserMutation.isPending}>
                      {userForm.id ? "Guardar cambios" : "Crear usuario"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="plaza-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">Usuarios registrados</h2>
                {usersLoading ? (
                  <p className="text-muted-foreground">Cargando usuarios...</p>
                ) : usersError ? (
                  <p className="text-destructive">Error al cargar usuarios.</p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground">No hay usuarios registrados.</p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email} {user.phone ? `• ${user.phone}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setUserForm(toUserFormValues(user))}>
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                            disabled={deleteUserMutation.isPending}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="space-y-8">
              <div className="plaza-card p-6">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">Pedidos recientes</h2>
                {ordersLoading ? (
                  <p className="text-muted-foreground">Cargando pedidos...</p>
                ) : ordersError ? (
                  <p className="text-destructive">Error al cargar pedidos.</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted-foreground">Aún no hay pedidos registrados.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <article key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                              Pedido #{order.id}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {order.user ? `${order.user.name} • ${order.user.email}` : "Usuario desconocido"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: S/{(order.totalCents / 100).toFixed(2)} • Estado: {order.status.toUpperCase()} • {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {order.status !== "paid" && (
                              <Button
                                variant="plaza"
                                size="sm"
                                onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: "paid" })}
                                disabled={updateOrderStatusMutation.isPending}
                              >
                                Marcar como pagado
                              </Button>
                            )}
                            {order.status !== "cancelled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderStatusMutation.mutate({ id: order.id, status: "cancelled" })}
                                disabled={updateOrderStatusMutation.isPending}
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="bg-secondary/40 rounded-lg p-3 space-y-2">
                          {order.items && order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span>{item.product?.name ?? "Producto"}</span>
                              <span>{item.quantity} x S/{(item.unitPriceCents / 100).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
