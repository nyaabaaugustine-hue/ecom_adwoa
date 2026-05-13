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

const mobileMoneyProviders = [
  { name: "MTN MoMo", color: "bg-yellow-400", text: "text-yellow-900" },
  { name: "Vodafone Cash", color: "bg-red-500", text: "text-white" },
  { name: "AirtelTigo", color: "bg-blue-600", text: "text-white" },
  { name: "Visa", color: "bg-blue-700", text: "text-white" },
  { name: "Mastercard", color: "bg-orange-500", text: "text-white" },
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

      {/* Ghana-Specific Promo Banner */}
      <section className="py-10 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Flag + Text */}
            <div className="flex items-center gap-4">
              <span className="text-4xl">🇬🇭</span>
              <div>
                <h3 className="text-white font-bold text-lg md:text-xl">
                  Proudly Made in Ghana
                </h3>
                <p className="text-emerald-200 text-sm">
                  Supporting local artisans & businesses across all 16 regions
                </p>
              </div>
            </div>

            {/* Center: Code */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 text-center">
              <p className="text-emerald-200 text-xs uppercase tracking-widest mb-1">
                Limited Offer
              </p>
              <p className="text-white text-2xl font-bold tracking-widest">
                ADWOA15
              </p>
              <p className="text-emerald-200 text-xs mt-1">
                15% off your first order
              </p>
            </div>

            {/* Right: Payment Methods */}
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-wider mb-3 text-center md:text-right">
                Secure Payments
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {mobileMoneyProviders.map((provider) => (
                  <span
                    key={provider.name}
                    className={`${provider.color} ${provider.text} text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap`}
                  >
                    {provider.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
