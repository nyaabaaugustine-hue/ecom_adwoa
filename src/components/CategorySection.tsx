"use client";
import { useEffect, useState } from "react";
import { SafeImage } from "./SafeImage";
import { Loader2, ArrowRight } from "lucide-react";
import { fetchProducts, type Product } from "../lib/store-api";

const CATEGORY_IMAGES: Record<string, string> = {
  Fashion: "adaw_tld2fa",
  Cosmetics: "uyy_ixp2x1",
  Skincare: "lk_oyxxa6",
  "Hair Care": "uyy_ixp2x1",
  Accessories: "adaw_tld2fa",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Fashion: "Ankara, Kente & More",
  Cosmetics: "Makeup & Beauty",
  Skincare: "Natural Glow",
  "Hair Care": "Natural Hair Love",
  Accessories: "Jewelry & More",
};

export function CategorySection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => { if (!cancelled) setProducts(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Derive categories from real products
  const catMap = new Map<string, { name: string; count: number; image: string; description: string }>();
  products.forEach((p) => {
    const existing = catMap.get(p.category) ?? {
      name: p.category,
      count: 0,
      image: CATEGORY_IMAGES[p.category] ?? p.image ?? "",
      description: CATEGORY_DESCRIPTIONS[p.category] ?? "",
    };
    existing.count++;
    catMap.set(p.category, existing);
  });

  const categories = Array.from(catMap.values()).map((c, i) => ({ id: i + 1, ...c }));

  if (!loading && categories.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-pink-500 text-sm font-semibold tracking-widest uppercase mb-2">Browse</p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-800 mb-2">Shop by Category</h2>
          <p className="text-gray-500 text-sm">Find exactly what you&apos;re looking for</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              className={`relative overflow-hidden rounded-2xl aspect-square group transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                activeCategory === category.id ? "ring-4 ring-pink-300 scale-105 shadow-xl" : "hover:scale-[1.02]"
              }`}
              aria-pressed={activeCategory === category.id}
              aria-label={`Filter by ${category.name}`}
            >
              <SafeImage
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-bold text-base leading-tight">{category.name}</h3>
                <p className="text-white/75 text-xs mt-0.5">{category.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <p className="text-pink-300 text-xs font-semibold">{category.count} items</p>
                  <ArrowRight size={12} className="text-pink-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
