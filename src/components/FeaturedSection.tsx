import { Truck, Shield, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "To all 16 regions of Ghana",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Mobile Money & Cards accepted",
  },
  {
    icon: Clock,
    title: "Fast Shipping",
    description: "Same day in Accra & Kumasi",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "100% authentic products",
  },
];

export function FeaturedSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-3xl p-8 md:p-12 mb-12 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="inline-block bg-white text-pink-500 px-4 py-1 rounded-full text-sm font-bold mb-4">
                Limited Time Offer
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get 30% Off on All Ankara Styles!
              </h3>
              <p className="text-white/90 mb-6">
                Celebrate Ghanaian fashion with our exclusive collection. Use
                code ANKARA30 at checkout.
              </p>
              <button className="bg-white hover:bg-pink-50 text-pink-500 font-bold px-8 py-4 rounded-xl shadow-lg">
                Shop Ankara Collection
              </button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/adaw_tld2fa.avif"
                  alt="Ankara Fashion"
                  className="w-48 h-48 rounded-full object-cover shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full flex items-center justify-center text-pink-500 font-bold shadow-lg text-xl">
                  30%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-pink-50 rounded-2xl p-6 text-center hover:bg-pink-100 transition-all"
            >
              <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <feature.icon size={24} className="text-white" />
              </div>
              <h4 className="text-gray-800 font-bold mb-1">{feature.title}</h4>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 text-center bg-pink-50 rounded-2xl p-8">
          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            Stay Connected with Adwoa's
          </h4>
          <p className="text-gray-500 mb-6">
            Get exclusive deals and style tips delivered to your phone
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="tel"
              placeholder="Your phone number"
              className="flex-1 px-4 py-3 rounded-xl border border-pink-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}