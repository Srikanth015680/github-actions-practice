import { useCallback, useEffect, useMemo, useState } from "react";
import { addToCart, clearCart, getCart, getProducts, removeCartItem, updateCartItem } from "./services/api";
const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], totalItems: 0, total: 0 });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshCart = useCallback(async () => setCart(await getCart()), []);
  useEffect(() => {
    Promise.all([getProducts(), getCart()])
      .then(([p, c]) => { setProducts(p.items); setCart(c); })
      .catch(error => setNotice(`Could not connect to API: ${error.message}. Is the backend running?`))
      .finally(() => setLoading(false));
  }, []);
  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category))], [products]);
  const filtered = products.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()) && (category === "All" || p.category === category));
  async function perform(action, message) {
    try { setCart(await action()); setNotice(message); } catch (error) { setNotice(error.message); }
  }
  return <div className="app-shell">
    <div className="announcement">A little something for your everyday ✦ Free shipping over ₹1,999</div>
    <header className="topbar">
      <a className="brand" href="#" aria-label="ShopFlow home"><span className="brand-mark">s</span> shopflow<span className="brand-dot">.</span></a>
      <div className="search-wrap"><span aria-hidden="true">⌕</span><input aria-label="Search products" placeholder="Search your next favourite..." value={query} onChange={e => setQuery(e.target.value)} /></div>
      <a className="cart-pill" href="#cart">Bag <span>{cart.totalItems}</span></a>
    </header>
    <main>
      <section className="hero"><div className="hero-copy"><p className="eyebrow">THE EVERYDAY EDIT · 2026</p><h1>Good things.<br/><em>Good days.</em></h1><p className="hero-description">Thoughtful finds for your desk, your downtime, and everywhere in between.</p><a className="primary-button" href="#products">Explore the collection <span>↗</span></a></div>
        <div className="hero-art" aria-label="Featured shopping essentials"><div className="sun-disc"/><div className="art-card art-card-back"><span>STAY CURIOUS</span><div className="abstract-shape">◒</div></div><div className="art-card art-card-front"><span>THE DAILY KIT</span><div className="product-illustration">🎧</div><b>Make room<br/>for good.</b></div><span className="floating-note">small joys, daily ↗</span></div>
      </section>
      <section id="products" className="products-section"><div className="section-heading"><div><p className="eyebrow">MADE FOR YOUR EVERYDAY</p><h2>Find your <em>thing.</em></h2></div><span className="result-count">{filtered.length} essentials</span></div>
        <div className="filters"><div className="category-list" aria-label="Filter by category">{categories.map(item => <button key={item} className={`category-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="filter-note">Considered picks, happy prices.</span></div>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notice">×</button></div>}
        {loading ? <p className="loading">Finding the good stuff…</p> : <div className="product-grid">{filtered.map((p, i) => <article className="product-card" key={p.id}><div className={`product-art art-tone-${i % 4}`}><span className="product-category">{p.category}</span><span className="product-emoji">{p.emoji}</span><button className="quick-add" onClick={() => perform(() => addToCart(p.id), `${p.name} added to your bag.`)} aria-label={`Add ${p.name} to cart`}>+</button></div><div className="product-info"><div><h3>{p.name}</h3><p>{p.description}</p></div><strong>{money(p.price)}</strong></div><div className="stock-note">● In stock</div></article>)}</div>}
        {!loading && filtered.length === 0 && <p className="empty-state">No matches just yet. Try another search.</p>}
      </section>
      <section id="cart" className="cart-section"><div className="section-heading"><div><p className="eyebrow">YOUR PICKS</p><h2>Your little <em>bag.</em></h2></div><span className="result-count">{cart.totalItems} items</span></div>
        {cart.items.length === 0 ? <div className="empty-cart"><span>♡</span><h3>Your bag is taking a breather.</h3><p>When something catches your eye, it’ll be waiting here.</p><a href="#products">Explore products ↗</a></div> : <><div className="cart-items">{cart.items.map(item => <div className="cart-item" key={item.productId}><div className="cart-item-emoji">{item.emoji}</div><div className="cart-item-info"><h3>{item.name}</h3><p>{money(item.price)} each</p><button className="remove-button" onClick={() => perform(() => removeCartItem(item.productId), "Item removed.")}>Remove</button></div><div className="quantity-control"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => item.quantity > 1 ? perform(() => updateCartItem(item.productId, item.quantity - 1), "Quantity updated.") : perform(() => removeCartItem(item.productId), "Item removed.")}>−</button><span>{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => perform(() => addToCart(item.productId), "Quantity updated.")}>+</button></div><strong className="line-total">{money(item.subtotal)}</strong></div>)}</div><div className="cart-summary"><button className="text-button" onClick={() => perform(clearCart, "Your bag is empty.")}>Clear bag</button><div><span>Subtotal</span><strong>{money(cart.total)}</strong><button className="checkout-button" onClick={() => setNotice("Checkout is a demo only. No payment is processed.")}>Continue to checkout <span>↗</span></button><p>Shipping and taxes calculated at checkout.</p></div></div></>}
      </section>
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark">s</span> shopflow<span className="brand-dot">.</span></a><span>Thoughtfully picked. Made for everyday.</span><span>Built for learning · 2026</span></footer>
  </div>;
}
