const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
export const getProducts = () => request("/api/products");
export const getCart = () => request("/api/cart");
export const addToCart = (productId, quantity = 1) => request("/api/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) });
export const updateCartItem = (productId, quantity) => request(`/api/cart/items/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity }) });
export const removeCartItem = (productId) => request(`/api/cart/items/${productId}`, { method: "DELETE" });
export const clearCart = () => request("/api/cart", { method: "DELETE" });
