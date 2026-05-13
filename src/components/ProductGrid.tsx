"use client";
import { useState } from "react";
import { Heart, Star, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import { products } from "../utils/products";
import { useCart } from "../context/CartContext";

interface ProductGridProps {
  onProductClick: (product: (typeof products)[0]) => void;
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const { addItem } = useCart();

  const filters = ["All", "Fashion", "Cosmetics", "Skincare", "Hair Care", "Accessories"];

  const filteredProducts =
    activeFilter === "All"
      ? products.slice(0, 12)
      : products.filter((p) => p.category === activeFilter).slice(0, 12);

  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    setAddedItems((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-pink-500 text-sm font-semibold tracking-widest uppercase mb-2">
              Our Products
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-800">
              Best Sellers
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 mt-4 md:mt-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-full transition-all ${
                  activeFilter === filter
                    ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                    : "text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => onProductClick(product)}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      product.badge === "New"
                        ? "bg-pink-500 text-white"
                        : product.badge === "Sale"
                        ? "bg-red-500 text-white"
                        : product.badge === "Bestseller"
                        ? "bg-gray-900 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Wishlist */}
                <div
                  className={`absolute top-3 right-3 transition-all duration-300 ${
                    hoveredProduct === product.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                >
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                      favorites.includes(product.id)
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-500"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={15} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Hover Actions */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300 ${
                    hoveredProduct === product.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`flex-1 font-semibold py-2.5 text-xs tracking-wide shadow-md flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                      addedItems.includes(product.id)
                        ? "bg-green-500 text-white"
                        : "bg-white/95 hover:bg-pink-500 hover:text-white text-gray-800"
                    }`}
                  >
                    <ShoppingBag size={13} />
                    {addedItems.includes(product.id) ? "Added!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="w-10 h-10 bg-white/95 hover:bg-gray-100 text-gray-700 shadow-md flex items-center justify-center rounded-lg transition-colors"
                    aria-label="Quick view"
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center px-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-medium">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-1 group-hover:text-pink-500 transition-colors text-sm">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-bold text-gray-800">GHc{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">GHc{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-gray-200 hover:border-pink-400 text-gray-700 hover:text-pink-500 font-semibold px-8 py-4 text-sm tracking-wide rounded-xl transition-all inline-flex items-center gap-2 group">
            VIEW ALL PRODUCTS
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
