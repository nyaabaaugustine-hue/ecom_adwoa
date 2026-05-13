import { useEffect, useRef, useState } from "react";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { products } from "../utils/products";
import { SafeImage } from "./SafeImage";

interface FeaturedCarouselProps {
  onAddToCart?: (product: any) => void;
}

export function FeaturedCarousel({ onAddToCart }: FeaturedCarouselProps) {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const animationRef = useRef<number>();

  const featuredProducts = products.filter(p => p.badge === "New" || p.badge === "Sale" || p.rating >= 4.5).slice(0, 8);

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  // Duplicate products for seamless loop
  const displayProducts = [...featuredProducts, ...featuredProducts];

  return (
    <section className="py-12 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-pink-500 text-sm font-medium uppercase tracking-wider">Don't Miss Out</span>
            <h2 className="text-3xl font-serif font-medium text-gray-800 mt-1">Featured Products</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
            Auto-scrolling • Hover to pause
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-6 overflow-x-hidden scrollbar-hide px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 w-72 group"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-pink-200 group-hover:-translate-y-2">
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    product.badge === 'Sale' 
                      ? 'bg-red-500 text-white' 
                      : product.badge === 'New'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {product.badge}
                  </span>
                )}
                
                {/* Discount Badge */}
                {product.originalPrice && (
                  <span className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
                
                {/* Quick Actions */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="flex-1 bg-white text-gray-800 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                  <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                    <Heart size={18} />
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
                      className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
                </div>
                
                <p className="text-xs text-pink-500 font-medium uppercase tracking-wide">{product.brand}</p>
                <h3 className="font-medium text-gray-800 mt-1 group-hover:text-pink-500 transition-colors truncate">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-800">GHc{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">GHc{product.originalPrice}</span>
                  )}
                </div>
                
                {/* Stock Indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-gray-500">
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="w-2 h-2 bg-pink-300 rounded-full" style={{ opacity: 0.3 + i * 0.15 }} />
          ))}
        </div>
      </div>
    </section>
  );
}