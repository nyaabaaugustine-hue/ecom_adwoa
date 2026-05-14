"use client";

import { useState } from "react";
import { Heart, Star, Eye, SlidersHorizontal, Grid, List, ChevronDown, X } from "lucide-react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Cart } from "./Cart";
import { ProductModal } from "./ProductModal";
import { LoginModal } from "./LoginModal";
import { Dashboard } from "./Dashboard";
import { AdminPanel } from "./AdminPanel";
import { CartProvider, useCart } from "../context/CartContext";
import { SafeImage } from "./SafeImage";
import { products, Product } from "../utils/products";
import { User, hasPermission } from "../utils/auth";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";
type Page = "shop" | "dashboard" | "admin";

const SORT_LABELS: Record<SortOption, string> = {
  featured:   "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating:     "Top Rated",
  newest:     "Newest",
};

interface ShopPageInnerProps {
  category: string;      // "All" | "Fashion" | "Cosmetics" | etc.
  title: string;
  description: string;
  heroBg: string;        // Cloudinary URL for the page hero strip
}

function ShopPageInner({ category, title, description, heroBg }: ShopPageInnerProps) {
  const [cartOpen, setCartOpen]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loginOpen, setLoginOpen]     = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("shop");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [sort, setSort]               = useState<SortOption>("featured");
  const [priceMax, setPriceMax]       = useState<number>(2000);
  const [favorites, setFavorites]     = useState<number[]>([]);
  const [hovered, setHovered]         = useState<number | null>(null);
  const [gridView, setGridView]       = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen]   = useState(false);

  const { items: cartItems, addItem, removeItem, updateQuantity } = useCart();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // ── Filter & sort ──────────────────────────────────────────────
  let filtered = category === "All"
    ? [...products]
    : products.filter((p) => p.category === category);

  if (category === "Sale") {
    filtered = products.filter((p) => p.badge === "Sale" || (p.originalPrice && p.originalPrice > p.price));
  }

  filtered = filtered.filter((p) => p.price <= priceMax);

  filtered = [...filtered].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating")     return b.rating - a.rating;
    return 0;
  });

  // ── Auth ───────────────────────────────────────────────────────
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setLoginOpen(false);
    if (user.role === "admin" || user.role === "manager") setCurrentPage("admin");
    else setCurrentPage("dashboard");
  };
  const handleLogout = () => { setCurrentUser(null); setCurrentPage("shop"); };
  const handleDashboardClick = () => {
    if (currentUser) {
      setCurrentPage(currentUser.role === "admin" || currentUser.role === "manager" ? "admin" : "dashboard");
    } else {
      setLoginOpen(true);
    }
  };

  if (currentPage === "admin" && currentUser)
    return <AdminPanel user={currentUser} onLogout={handleLogout} />;
  if (currentPage === "dashboard" && currentUser)
    return <Dashboard user={currentUser} onLogout={handleLogout} hasPermission={(p) => hasPermission(currentUser.role, p)} />;

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onDashboardClick={handleDashboardClick}
        isAuthenticated={!!currentUser}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* ── Page Hero Strip ──────────────────────────────────────── */}
      <div className="relative h-52 md:h-64 overflow-hidden flex items-center justify-center">
        <img
          src={heroBg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.55 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/60 via-rose-400/40 to-fuchsia-500/40" />
        <div className="relative text-center px-4">
          <p className="text-pink-100 text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            Adwoa&apos;s Beauty
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-lg mb-3">
            {title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">{description}</p>
        </div>
      </div>

      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-400">
        <a href="/" className="hover:text-pink-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-gray-700 font-medium">{title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* ── Toolbar ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-500 border border-gray-200 rounded-lg px-3 py-2 hover:border-pink-200 transition-all"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            <span className="text-sm text-gray-400">{filtered.length} products</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none text-sm text-gray-600 border border-gray-200 rounded-lg pl-3 pr-8 py-2 hover:border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100 bg-white cursor-pointer"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                  <option key={k} value={k}>{SORT_LABELS[k]}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Grid / List toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setGridView("grid")}
                className={`p-2 ${gridView === "grid" ? "bg-pink-500 text-white" : "text-gray-400 hover:bg-gray-50"} transition-colors`}
              ><Grid size={15} /></button>
              <button
                onClick={() => setGridView("list")}
                className={`p-2 ${gridView === "list" ? "bg-pink-500 text-white" : "text-gray-400 hover:bg-gray-50"} transition-colors`}
              ><List size={15} /></button>
            </div>
          </div>
        </div>

        {/* ── Filter drawer (inline) ────────────────────────────── */}
        {filterOpen && (
          <div className="bg-pink-50/70 rounded-2xl p-5 mb-6 border border-pink-100 flex flex-wrap gap-6 items-start">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Max Price: <span className="text-pink-500">GHc{priceMax}</span></p>
                <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              </div>
              <input
                type="range" min={50} max={2000} step={50} value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>GHc50</span><span>GHc2,000</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Product Grid ─────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-lg font-medium text-gray-600">No products found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : gridView === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHovered(product.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-3">
                  <SafeImage src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md ${
                      product.badge === "New" ? "bg-pink-500 text-white" :
                      product.badge === "Sale" ? "bg-red-500 text-white" :
                      product.badge === "Bestseller" ? "bg-gray-800 text-white" :
                      "bg-white text-gray-800"}`}>
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => toggleFav(product.id, e)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                      hovered === product.id ? "opacity-100" : "opacity-0"} ${
                      favorites.includes(product.id) ? "bg-pink-500 text-white" : "bg-white text-gray-600 hover:bg-pink-50"}`}
                  >
                    <Heart size={14} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                  <div className={`absolute bottom-0 left-0 right-0 p-2 transition-all duration-300 ${hovered === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                      className="w-full bg-white/95 hover:bg-white text-gray-800 font-semibold py-2.5 text-xs tracking-wide rounded-lg shadow flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} /> QUICK VIEW
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{product.brand}</p>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-pink-500 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={9} className={i < Math.floor(product.rating) ? "text-pink-400 fill-pink-400" : "text-gray-200"} />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">GHc{product.price}</span>
                  {product.originalPrice && <span className="text-xs text-gray-400 line-through">GHc{product.originalPrice}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="flex flex-col gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="flex gap-5 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-pink-100 transition-all cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative w-28 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <SafeImage src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 py-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-pink-500 transition-colors mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={i < Math.floor(product.rating) ? "text-pink-400 fill-pink-400" : "text-gray-200"} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">GHc{product.price}</span>
                    {product.originalPrice && <span className="text-sm text-gray-400 line-through">GHc{product.originalPrice}</span>}
                    <button
                      onClick={(e) => { e.stopPropagation(); addItem({ ...product, quantity: 1 }); }}
                      className="ml-auto bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addItem} />
      )}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
    </div>
  );
}

export function ShopPageLayout(props: ShopPageInnerProps) {
  return (
    <CartProvider>
      <ShopPageInner {...props} />
    </CartProvider>
  );
}
