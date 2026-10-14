const express = require("express");
const products = require("../data/products");
const router = express.Router();

router.get("/", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const category = String(req.query.category || "").toLowerCase();
  const items = products.filter(p =>
    (!q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)) &&
    (!category || p.category.toLowerCase() === category)
  );
  res.json({ items, count: items.length });
});

router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json(product);
});
module.exports = router;
