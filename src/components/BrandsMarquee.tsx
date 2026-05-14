"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const realBrands = [
  { name: "Century", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721550/CENTURY_LOGO_100_x_40px_gib6xt.png", w: 100, h: 40 },
  { name: "Guinness", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721550/Guiness_190_40_a96kqg.jpg", w: 190, h: 40 },
  { name: "Akai", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721550/Akai_90_18_ekfm46.jpg", w: 90, h: 18 },
  { name: "Samsung", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721549/Samsung_80_20_ydiopt.jpg", w: 80, h: 20 },
  { name: "Infinix", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721550/Infinix_100_20_gxpdoi.jpg", w: 100, h: 20 },
  { name: "LG", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721549/LG_150_30_oixv9x.jpg", w: 150, h: 30 },
  { name: "Pedrini", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721549/PEDRINI_ncuci7.jpg", w: 110, h: 36 },
  { name: "Yam", image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721549/yam_dzewmz.jpg", w: 90, h: 36 },
];

export function BrandsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>();
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.4;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const doubled = [...realBrands, ...realBrands];

  return (
    <section className="py-8 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400 font-bold">
          Trusted Partner Brands
        </p>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div ref={trackRef} className="flex items-center gap-6 w-max" style={{ willChange: "transform" }}>
          {doubled.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 cursor-default group"
              style={{
                borderRadius: "6%",
                border: "1.5px solid #e5e7eb",
                minWidth: 160,
                minHeight: 72,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="relative flex items-center justify-center" style={{ width: Math.min(brand.w * 1.2, 140), height: 48 }}>
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={Math.min(brand.w * 1.2, 140)}
                  height={Math.min(brand.h * 1.5, 48)}
                  className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100"
                  style={{ maxHeight: 48, width: "auto" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
