"use client";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const announcements = [
  "🎉 Free Shipping on orders over GHc200 across all 16 regions!",
  "💫 Use Code ADWOA15 for 15% off your first order",
  "🇬🇭 Proudly supporting Ghanaian artisans & local businesses",
  "⚡ Same-day delivery available in Accra & Kumasi",
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="bg-gray-900 text-white relative">
      <div className="max-w-7xl mx-auto px-10 py-2.5 flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length)}
          className="text-white/50 hover:text-white transition-colors p-1 hidden sm:block"
          aria-label="Previous announcement"
        >
          <ChevronLeft size={14} />
        </button>
        <p className="text-center text-xs sm:text-sm font-medium tracking-wide min-h-[1.25rem]">
          {announcements[current]}
        </p>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % announcements.length)}
          className="text-white/50 hover:text-white transition-colors p-1 hidden sm:block"
          aria-label="Next announcement"
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
