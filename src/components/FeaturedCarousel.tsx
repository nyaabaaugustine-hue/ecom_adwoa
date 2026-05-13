"use client";
import { useEffect, useRef, useState } from "react";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { products } from "../utils/products";
import { useCart } from "../context/CartContext";

export function FeaturedCarousel() {
  const [isHovered, setIsHovered] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);
  const { addItem } = useCart();

  const featuredProducts = products
    .filter((p) => p.badge === "New" || p.badge === "Sale" || p.rating >= 4.8)
    .slice(0, 8);

  const displayProducts = [...featuredProducts, ...featuredProducts];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const animate = () => {
      if (!isHovered) {
        positionRef.current += 0.5;
        if (positionRef.current >= scrollContainer.scrollWidth / 2) {
          positionRef.current = 0;
        }
        scrollContainer.scrollLeft = positionRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  const handleAddToCart = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    setAddedItems((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-12 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-pink-500 text-sm font-semibold uppercase tracking-wider">
              Don&apos;t Miss Out
            </span>
            <h2 className="text-3xl font-serif font-medium text-gray-800 mt-1">
              Featured Products
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
            Auto-scrolling · Hover to pause
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-6 overflow-x-hidden px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayProducts.map((product, index) => (
          <div key={`${product.id}-${index}`} className="flex-shrink-0 w-72 group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-pink-200 group-hover:-translate-y-2">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                      product.badge === "Sale"
                        ? "bg-red-500 text-white"
                        : product.badge === "New"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {product.originalPrice && (
                  <span className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                      addedItems.includes(product.id)
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-800 hover:bg-pink-500 hover:text-white"
                    }`}
                  >
                    <ShoppingBag size={15} />
                    {addedItems.includes(product.id) ? "Added!" : "Add to Cart"}
                  </button>
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      favorites.includes(product.id)
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-600 hover:bg-pink-500 hover:text-white"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={16} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
                </div>
                <p className="text-xs text-pink-500 font-semibold uppercase tracking-wide">
                  {product.brand}
                </p>
                <h3 className="font-medium text-gray-800 mt-1 group-hover:text-pink-500 transition-colors truncate text-sm">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-800">GHc{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      GHc{product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      (product.stock ?? 99) > 10
                        ? "bg-green-400"
                        : (product.stock ?? 0) > 0
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    {(product.stock ?? 99) > 10
                      ? "In Stock"
                      : (product.stock ?? 0) > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 bg-pink-300 rounded-full"
            style={{ opacity: 0.3 + i * 0.15 }}
          />
        ))}
      </div>
    </section>
  );
}
