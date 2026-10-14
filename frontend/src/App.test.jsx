import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
vi.mock("./services/api", () => ({ getProducts: vi.fn(), getCart: vi.fn(), addToCart: vi.fn(), updateCartItem: vi.fn(), removeCartItem: vi.fn(), clearCart: vi.fn() }));
import { getProducts, getCart } from "./services/api";
describe("ShopFlow frontend", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getProducts.mockResolvedValue({ items: [{ id: "1", name: "Wireless Headphones", description: "Everyday sound", price: 2499, stock: 10, category: "Electronics", emoji: "🎧" }], count: 1 });
    getCart.mockResolvedValue({ items: [], totalItems: 0, total: 0 });
  });
  it("renders the storefront and products", async () => {
    render(<App />);
    expect(await screen.findByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText(/Good things/i)).toBeInTheDocument();
  });
});
