"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <span className="text-4xl mb-4 block">💌</span>
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-white mb-3">
              Join the Adwoa&apos;s Family
            </h2>
            <p className="text-pink-100 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
              Subscribe to receive exclusive offers, new arrivals, and beauty
              tips straight to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-white">
                <CheckCircle size={20} />
                <span className="font-medium">
                  You&apos;re subscribed! Welcome to the family 🎉
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3.5 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3.5 text-sm tracking-wide rounded-xl whitespace-nowrap inline-flex items-center justify-center gap-2 group transition-colors"
                >
                  SUBSCRIBE
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>
            )}

            <p className="text-pink-200 text-xs mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe
              anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
