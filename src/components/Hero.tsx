import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Kente-inspired decorative top border */}
      <div className="h-1.5 bg-gradient-to-r from-red-600 via-yellow-400 via-green-600 to-red-600" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 py-12 md:py-20 items-center">
          {/* Content */}
          <div className="flex flex-col justify-center order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="text-lg">🇬🇭</span>
              <p className="text-pink-600 text-xs font-bold tracking-widest uppercase">
                Ghana&apos;s Premier Beauty Destination
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-[1.1]">
              Discover Your
              <br />
              <span className="relative">
                <span className="text-pink-500">Natural Beauty</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C60 3 120 1 180 4C220 6 260 8 298 5"
                    stroke="#f9a8d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              Curated collection of authentic Ghanaian fashion, cosmetics, and
              skincare. Embrace your beauty with products made for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 text-sm tracking-widest rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all flex items-center justify-center gap-2 group">
                SHOP COLLECTION
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button className="border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-500 font-semibold px-8 py-4 text-sm tracking-widest rounded-xl transition-all">
                NEW ARRIVALS
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-gray-900">5K+</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Products</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-gray-900">10K+</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-gray-900">16</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Regions</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 md:order-2">
            {/* Decorative background shape */}
            <div className="absolute inset-0 -right-8 bg-gradient-to-br from-pink-100 to-amber-50 rounded-3xl transform rotate-3" />

            <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-pink-100">
              <img
                src="https://images.unsplash.com/photo-1590779070934-0d5e57a7fd48?w=600&h=750&fit=crop"
                alt="Ghanaian fashion model"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Card — New Season */}
            <div className="absolute -bottom-5 -left-5 md:-left-10 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">New Season</p>
                  <p className="text-[10px] text-gray-400">Spring Collection &apos;25</p>
                </div>
              </div>
            </div>

            {/* Floating Card — Rating */}
            <div className="absolute top-6 -right-4 md:-right-8 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-1">Customer Rating</p>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-base">★★★★★</span>
                <span className="text-sm font-bold text-gray-800">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
