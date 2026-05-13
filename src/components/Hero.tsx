import { ArrowRight } from "lucide-react";
import { SafeImage } from "./SafeImage";

export function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 py-12 md:py-20">
          {/* Content */}
          <div className="flex flex-col justify-center order-2 md:order-1">
            <p className="text-pink-500 text-sm font-medium tracking-widest uppercase mb-4">
              Ghana's Premier Beauty Destination
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-800 mb-6 leading-tight">
              Discover Your
              <br />
              <span className="text-pink-500">Natural Beauty</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              Curated collection of authentic Ghanaian fashion, cosmetics, and skincare. 
              Embrace your beauty with products made for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-8 py-4 text-sm tracking-wide rounded-md shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group">
                SHOP COLLECTION
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-gray-300 text-gray-700 hover:border-pink-300 hover:text-pink-500 font-medium px-8 py-4 text-sm tracking-wide rounded-md transition-all">
                EXPLORE NEW ARRIVALS
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-serif font-medium text-gray-800">5K+</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Products</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-serif font-medium text-gray-800">10K+</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-serif font-medium text-gray-800">16</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Regions</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 md:order-2">
            <div className="relative aspect-[4/5] md:aspect-square rounded-lg overflow-hidden bg-pink-50">
              <SafeImage
                src="adaw_tld2fa"
                alt="African Fashion"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">New Season</p>
                  <p className="text-xs text-gray-400">Spring Collection '24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}