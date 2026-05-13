"use client";
import { useState } from "react";
import { categories } from "../utils/products";
import { ArrowRight } from "lucide-react";

export function CategorySection() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-pink-500 text-sm font-semibold tracking-widest uppercase mb-2">
            Browse
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-800 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-sm">
            Find exactly what you&apos;re looking for
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setActiveCategory(
                  activeCategory === category.id ? null : category.id
                )
              }
              className={`relative overflow-hidden rounded-2xl aspect-square group transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                activeCategory === category.id
                  ? "ring-4 ring-pink-300 scale-105 shadow-xl"
                  : "hover:scale-[1.02]"
              }`}
              aria-pressed={activeCategory === category.id}
              aria-label={`Filter by ${category.name}`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-bold text-base leading-tight">
                  {category.name}
                </h3>
                <p className="text-white/75 text-xs mt-0.5">{category.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <p className="text-pink-300 text-xs font-semibold">
                    {category.count} items
                  </p>
                  <ArrowRight
                    size={12}
                    className="text-pink-300 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
