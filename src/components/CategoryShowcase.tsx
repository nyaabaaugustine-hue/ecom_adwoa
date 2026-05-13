import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Fashion",
    subtitle: "Ankara & Kente",
    image: "https://images.unsplash.com/photo-1590779070934-0d5e57a7fd48?w=500&h=600&fit=crop",
    count: "10 Products",
  },
  {
    id: 2,
    name: "Cosmetics",
    subtitle: "Makeup Essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=600&fit=crop",
    count: "10 Products",
  },
  {
    id: 3,
    name: "Skincare",
    subtitle: "Natural Glow",
    image: "https://images.unsplash.com/photo-1556228720-195a672d1a27?w=500&h=600&fit=crop",
    count: "10 Products",
  },
  {
    id: 4,
    name: "Hair Care",
    subtitle: "Natural Hair Love",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=600&fit=crop",
    count: "10 Products",
  },
  {
    id: 5,
    name: "Accessories",
    subtitle: "Jewelry & More",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=600&fit=crop",
    count: "10 Products",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-pink-500 text-sm font-medium tracking-widest uppercase mb-2">
            Browse Categories
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-800">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href="#"
              className="group relative overflow-hidden rounded-lg aspect-[3/4] md:aspect-[2/3]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-serif text-lg font-medium">
                  {category.name}
                </h3>
                <p className="text-white/70 text-xs mb-2">{category.subtitle}</p>
                <div className="flex items-center gap-1 text-pink-300 text-xs font-medium group-hover:gap-2 transition-all">
                  <span>Shop Now</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}