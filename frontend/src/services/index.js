import api from './api.js';

// Servicios para Productos
export const productService = {
  // Obtener todos los productos
  getAll: () => api.get('/products'),
  
  // Obtener producto por ID
  getById: (id) => api.get(`/products/${id}`),
  
  // Obtener productos por categoría
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  
  // Obtener productos con descuento
  getDiscounted: () => api.get('/products/discount'),
  
  // Obtener productos disponibles
  getAvailable: () => api.get('/products/available'),
  
  // Buscar productos
  search: (category, search) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return api.get(`/products/search?${params}`);
  },
  
  // Crear producto
  create: (product) => api.post('/products', product),
  
  // Actualizar producto
  update: (id, product) => api.put(`/products/${id}`, product),
  
  // Actualizar inventario
  updateInventory: (id, inventory) => 
    api.patch(`/products/${id}/inventory?inventory=${inventory}`),
  
  // Eliminar producto
  delete: (id) => api.delete(`/products/${id}`),
};

// Servicios para Categorías
export const categoryService = {
  // Obtener todas las categorías
  getAll: () => api.get('/categories'),
  
  // Obtener categoría por ID
  getById: (id) => api.get(`/categories/${id}`),
  
  // Buscar categoría por nombre
  getByName: (name) => api.get(`/categories/name/${name}`),
  
  // Obtener categorías raíz (sin padre)
  getRootCategories: () => api.get('/categories?parentId=null'),
  
  // Obtener subcategorías
  getSubcategories: (parentId) => api.get(`/categories?parentId=${parentId}`),
  
  // Crear categoría
  create: (category) => api.post('/categories', category),
  
  // Actualizar categoría
  update: (id, category) => api.put(`/categories/${id}`, category),
  
  // Eliminar categoría
  delete: (id) => api.delete(`/categories/${id}`),
};

// Servicios para Usuarios
export const userService = {
  // Obtener todos los usuarios
  getAll: () => api.get('/users'),
  
  // Obtener usuario por ID
  getById: (id) => api.get(`/users/${id}`),
  
  // Obtener usuario por email
  getByEmail: (email) => api.get(`/users/email/${email}`),
  
  // Crear usuario
  create: (user) => api.post('/users', user),
  
  // Actualizar usuario
  update: (id, user) => api.put(`/users/${id}`, user),
  
  // Eliminar usuario
  delete: (id) => api.delete(`/users/${id}`),
  
  // Verificar si email existe
  emailExists: (email) => api.get(`/users/exists/email/${email}`),
};

// Servicios para Carrito
export const cartService = {
  // Obtener carrito de un usuario
  getByUserId: (userId) => api.get(`/carts/user/${userId}`),
  
  // Crear carrito para usuario
  createForUser: (userId) => api.post(`/carts/user/${userId}`),
  
  // Agregar item al carrito
  addItem: (cartId, item) => api.post(`/carts/${cartId}/items`, item),
  
  // Actualizar item del carrito
  updateItem: (cartId, itemId, item) => api.put(`/carts/${cartId}/items/${itemId}`, item),
  
  // Eliminar item del carrito
  removeItem: (cartId, itemId) => api.delete(`/carts/${cartId}/items/${itemId}`),
  
  // Vaciar carrito
  clear: (cartId) => api.delete(`/carts/${cartId}/items`),
  
  // Obtener items del carrito
  getItems: (cartId) => api.get(`/carts/${cartId}/items`),
};

// Servicios para Pedidos
export const orderService = {
  // Obtener todos los pedidos
  getAll: () => api.get('/orders'),
  
  // Obtener pedido por ID
  getById: (id) => api.get(`/orders/${id}`),
  
  // Obtener pedidos de un usuario
  getByUserId: (userId) => api.get(`/orders/user/${userId}`),
  
  // Obtener pedidos por estado
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  
  // Crear pedido
  create: (order) => api.post('/orders', order),
  
  // Actualizar estado de pedido
  updateStatus: (id, status) => api.put(`/orders/${id}/status?status=${status}`),
  
  // Eliminar pedido
  delete: (id) => api.delete(`/orders/${id}`),
};
