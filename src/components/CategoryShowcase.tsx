import { ArrowRight } from "lucide-react";
import { SafeImage } from "./SafeImage";

const categories = [
  {
    id: 1,
    name: "Fashion",
    subtitle: "Ankara & Kente",
    image: "adaw_tld2fa",
    count: "10 Products",
  },
  {
    id: 2,
    name: "Cosmetics",
    subtitle: "Makeup Essentials",
    image: "uyy_ixp2x1",
    count: "10 Products",
  },
  {
    id: 3,
    name: "Skincare",
    subtitle: "Natural Glow",
    image: "lk_oyxxa6",
    count: "10 Products",
  },
  {
    id: 4,
    name: "Hair Care",
    subtitle: "Natural Hair Love",
    image: "uyy_ixp2x1",
    count: "10 Products",
  },
  {
    id: 5,
    name: "Accessories",
    subtitle: "Jewelry & More",
    image: "adaw_tld2fa",
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
              <SafeImage
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
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