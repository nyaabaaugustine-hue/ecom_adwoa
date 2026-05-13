"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// ── Hero slides using Cloudinary images (served via Vercel image optimisation) ──
const SLIDES = [
  {
    src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    alt: "Authentic Ghanaian Skincare",
    badge: "New Season",
    sub: "Spring Collection '25",
  },
  {
    src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/d_default.jpg/v1/adaw_tld2fa",
    alt: "Ankara & African Fashion",
    badge: "Trending Now",
    sub: "Ankara Collection",
  },
  {
    src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/d_default.jpg/v1/uyy_ixp2x1",
    alt: "Ghana Beauty Cosmetics",
    badge: "Best Seller",
    sub: "Cosmetics & Glow",
  },
];

const STATS = [
  { value: "5K+", label: "Products" },
  { value: "10K+", label: "Customers" },
  { value: "16", label: "Regions" },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-advance every 4 s
  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, [current]);

  function goTo(index: number) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 350);
  }

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  return (
    <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 overflow-hidden">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 py-14 md:py-24 items-center">

          {/* ── Left: Copy ─────────────────────────────────────── */}
          <div className="flex flex-col justify-center order-2 md:order-1">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">
                Ghana's Premier Beauty Destination
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-gray-900 mb-5 leading-[1.12]">
              Discover Your
              <br />
              <span className="relative inline-block text-pink-500">
                Natural Beauty
                {/* Underline accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8 Q75 2, 150 7 Q225 12, 298 5"
                    stroke="#f472b6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            {/* Body */}
            <p className="text-gray-500 text-base md:text-lg mb-8 max-w-[26rem] leading-relaxed">
              Curated collection of authentic Ghanaian fashion, cosmetics, and
              skincare. Embrace your beauty with products made for you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button className="group relative inline-flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-semibold px-8 py-4 text-sm tracking-wide rounded-xl shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-200">
                SHOP COLLECTION
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-500 font-semibold px-8 py-4 text-sm tracking-wide rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200">
                EXPLORE NEW ARRIVALS
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-0 border-t border-gray-100 pt-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div className="px-5 first:pl-0 text-center">
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 tabular-nums">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                      {s.label}
                    </p>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="w-px h-10 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image Slideshow ──────────────────────────── */}
          <div className="relative order-1 md:order-2 flex justify-center">

            {/* Main image frame */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-pink-200/40 ring-1 ring-pink-100">

              {/* Slides */}
              {SLIDES.map((slide, i) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={[
                    "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out",
                    i === current
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105 pointer-events-none",
                  ].join(" ")}
                />
              ))}

              {/* Gradient overlay — bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Slide badge (bottom-left) */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-pink-500" />
                    <p className="text-xs font-semibold text-gray-800">
                      {SLIDES[current].badge}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {SLIDES[current].sub}
                  </p>
                </div>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={[
                        "h-1.5 rounded-full transition-all duration-300",
                        i === current
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/80",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>

              {/* Prev / Next arrows */}
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
              >
                <ChevronRight size={16} className="text-gray-700" />
              </button>
            </div>

            {/* Floating promo chip — top right */}
            <div className="absolute -top-4 -right-2 md:-right-8 bg-pink-500 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg shadow-pink-300/50 rotate-3">
              NEW IN ✨
            </div>

            {/* Floating trust chip — left */}
            <div className="absolute top-1/3 -left-4 md:-left-10 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-pink-50">
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-lg">
                🇬🇭
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                  Made in Ghana
                </p>
                <p className="text-[10px] text-gray-400">100% Authentic</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
