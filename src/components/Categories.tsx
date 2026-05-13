import { useState } from "react";
import { categories } from "../utils/products";

export function Categories() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-500">Find exactly what you're looking for</p>
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
              className={`relative overflow-hidden rounded-2xl aspect-square group transition-all duration-300 hover:shadow-xl ${
                activeCategory === category.id
                  ? "ring-4 ring-pink-300 scale-105"
                  : ""
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.description}</p>
                <p className="text-pink-300 text-xs mt-1">
                  {category.count} products
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}