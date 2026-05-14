import Image from "next/image";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free shipping on all orders over GHc200 across Ghana",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "All products are genuine and quality-verified by our team",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free 30-day return policy on all purchases",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer care team is always ready to assist you",
    color: "bg-pink-50 text-pink-600",
  },
];

const paymentLogos = [
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/mtn_fb2z77.jpg",         alt: "MTN Mobile Money" },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/telecel_qpjsan.png",     alt: "Telecel Cash" },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/airteltigo_egkalj.jpg",  alt: "AirtelTigo Money" },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721235/visa_rgiuko.png",        alt: "Visa" },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721235/masetercard_eldi1v.png", alt: "Mastercard" },
];

export function PromoBanner() {
  return (
    <>
      {/* Features Strip */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center gap-3 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Promo code */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-8 py-5 text-center shrink-0">
              <p className="text-emerald-200 text-xs uppercase tracking-widest mb-1">Limited Offer</p>
              <p className="text-white text-3xl font-bold tracking-widest">ADWOA15</p>
              <p className="text-emerald-200 text-xs mt-1">15% off your first order</p>
            </div>

            {/* Payment logos */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <p className="text-emerald-200 text-xs uppercase tracking-wider font-semibold">
                Secure Payments Accepted
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                {paymentLogos.map((logo) => (
                  <div
                    key={logo.alt}
                    className="w-[64px] h-[40px] bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md hover:scale-105 transition-transform duration-200"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={56}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
