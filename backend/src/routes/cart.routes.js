const express = require("express");
const products = require("../data/products");
const router = express.Router();
const cart = new Map(); // Learning-only in-memory cart; resets when server restarts.

function getCart() {
  const items = [...cart.values()].map(({ productId, quantity }) => {
    const p = products.find(item => item.id === productId);
    return { productId, name: p.name, price: p.price, emoji: p.emoji, quantity, subtotal: p.price * quantity };
  });
  return { items, totalItems: items.reduce((s, i) => s + i.quantity, 0), total: items.reduce((s, i) => s + i.subtotal, 0) };
}
router.get("/", (_req, res) => res.json(getCart()));

router.post("/items", (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  if (typeof productId !== "string" || !productId.trim()) return res.status(400).json({ error: "productId must be a non-empty string" });
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: "quantity must be a positive integer" });
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  const current = cart.get(productId)?.quantity || 0;
  if (current + quantity > product.stock) return res.status(400).json({ error: "Requested quantity exceeds available stock" });
  cart.set(productId, { productId, quantity: current + quantity });
  return res.status(201).json(getCart());
});

router.patch("/items/:productId", (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body || {};
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (!cart.has(productId)) return res.status(404).json({ error: "Product is not in the cart" });
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: "quantity must be a positive integer" });
  if (quantity > product.stock) return res.status(400).json({ error: "Requested quantity exceeds available stock" });
  cart.set(productId, { productId, quantity });
  return res.json(getCart());
});

router.delete("/items/:productId", (req, res) => {
  if (!cart.has(req.params.productId)) return res.status(404).json({ error: "Product is not in the cart" });
  cart.delete(req.params.productId);
  return res.json(getCart());
});
router.delete("/", (_req, res) => { cart.clear(); return res.json(getCart()); });
module.exports = router;
