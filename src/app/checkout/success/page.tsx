"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Package, Truck, Clock, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AnnouncementBar } from "@/components/AnnouncementBar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (ref) {
          const response = await fetch(`/api/orders?reference=${ref}`);
          if (response.ok) {
            const data = await response.json();
            setOrderData(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [ref]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={60} className="text-green-500" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-3">Payment Successful!</h1>
        <p className="text-lg text-gray-600">Thank you for your order. Your purchase has been confirmed.</p>
      </div>

      {/* Order Reference */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-8">
        <p className="text-center text-gray-600 text-sm mb-2">Order Reference</p>
        <p className="text-center font-mono text-2xl font-bold text-green-700">{ref || "Processing..."}</p>
        <p className="text-center text-xs text-gray-500 mt-2">Save this number — you'll need it for order tracking</p>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status</h2>
        <div className="space-y-4">
          {[
            { icon: "✓", label: "Order Confirmed", desc: "Payment received and verified", done: true, color: "bg-green-500" },
            { icon: "⏱", label: "Processing", desc: "Your order is being prepared", done: false, pulse: true, color: "bg-blue-500" },
            { icon: "📦", label: "Ready to Ship", desc: "We'll notify you when your items ship", done: false, color: "bg-gray-300" },
            { icon: "🚚", label: "Delivered", desc: "Package arrives at your location", done: false, color: "bg-gray-300" },
          ].map((step) => (
            <div key={step.label} className="flex items-start gap-4">
              <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${step.pulse ? "animate-pulse" : ""}`}>
                {step.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{step.label}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Clock size={32} className="text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600">Your order ships within 24 hours</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <Truck size={32} className="text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Free Delivery</h3>
          <p className="text-sm text-gray-600">In Accra &amp; Kumasi (2–3 days)</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <Package size={32} className="text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Easy Returns</h3>
          <p className="text-sm text-gray-600">30-day return policy</p>
        </div>
      </div>

      {/* Order Details */}
      {orderData && (
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Details</h2>
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            {(Array.isArray(orderData.items) ? orderData.items : JSON.parse(orderData.items ?? "[]")).map((item: any) => (
              <div key={item.id} className="flex justify-between text-gray-700">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium">GHc{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>GHc{Number(orderData.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between text-green-600 font-medium mb-3"><span>Shipping</span><span>FREE</span></div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-gray-200">
              <span>Total</span><span className="text-pink-500">GHc{Number(orderData.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Support */}
      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-8 text-center mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Need Help?</h2>
        <p className="text-gray-600 mb-4">Our team is available Mon–Sat, 8 AM–8 PM (Ghana time)</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:+233501234567" className="border border-pink-300 text-pink-600 hover:bg-pink-100 font-medium px-6 py-3 rounded-lg transition-colors">📞 Call Us</a>
          <a href="mailto:support@adwoasbeauty.com" className="border border-pink-300 text-pink-600 hover:bg-pink-100 font-medium px-6 py-3 rounded-lg transition-colors">✉️ Email Support</a>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button onClick={() => router.push("/")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2">
          Continue Shopping <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header cartCount={0} onCartClick={() => {}} onDashboardClick={() => {}} isAuthenticated={false} user={null} onLogout={() => {}} />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your order…</p>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
