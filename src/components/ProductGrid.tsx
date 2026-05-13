import { useState } from "react";
import { Heart, Star, Eye, ArrowRight } from "lucide-react";
import { products } from "../utils/products";
import { SafeImage } from "./SafeImage";

interface ProductGridProps {
  onProductClick: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

export function ProductGrid({ onProductClick, onAddToCart }: ProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Fashion", "Cosmetics", "Skincare", "Hair Care", "Accessories"];

  const filteredProducts = activeFilter === "All" 
    ? products.slice(0, 12) 
    : products.filter(p => p.category === activeFilter).slice(0, 12);

  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-pink-500 text-sm font-medium tracking-widest uppercase mb-2">
              Our Products
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-800">
              Best Sellers
            </h2>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                  activeFilter === filter
                    ? "text-pink-500 border-b-2 border-pink-500"
                    : "text-gray-400 hover:text-gray-600"
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
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium tracking-wide ${
                      product.badge === "New"
                        ? "bg-pink-500 text-white"
                        : product.badge === "Sale"
                        ? "bg-red-500 text-white"
                        : product.badge === "Bestseller"
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Quick Actions */}
                <div
                  className={`absolute top-3 right-3 transition-all duration-300 ${
                    hoveredProduct === product.id
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                      favorites.includes(product.id)
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 hover:bg-pink-50"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={favorites.includes(product.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Quick View Button */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
                    hoveredProduct === product.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="w-full bg-white/95 hover:bg-white text-gray-800 font-medium py-3 text-xs tracking-wide shadow-md flex items-center justify-center gap-2"
                  >
                    <Eye size={14} />
                    QUICK VIEW
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {product.brand}
                </p>
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-1 group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-pink-400 fill-pink-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-medium text-gray-800">
                    GHc{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      GHc{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="border border-gray-300 text-gray-700 hover:border-pink-300 hover:text-pink-500 font-medium px-8 py-4 text-sm tracking-wide rounded-md transition-all inline-flex items-center gap-2 group">
            VIEW ALL PRODUCTS
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}