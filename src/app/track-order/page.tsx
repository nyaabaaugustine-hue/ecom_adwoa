"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, AlertCircle } from "lucide-react";
import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Footer } from "../../components/Footer";
import { StaticHeader } from "../../components/StaticHeader";

const demoOrders: Record<string, { status: string; customer: string; items: string[]; placed: string; eta: string; steps: { label: string; done: boolean; active: boolean; time: string }[] }> = {
  "ADW-2024-001": {
    status: "In Transit",
    customer: "Adwoa Mensah",
    items: ["Ankara Maxi Dress", "Shea Butter Lip Gloss Set"],
    placed: "12 May 2024",
    eta: "14 May 2024",
    steps: [
      { label: "Order Placed", done: true, active: false, time: "12 May, 9:00 AM" },
      { label: "Payment Confirmed", done: true, active: false, time: "12 May, 9:05 AM" },
      { label: "Processing", done: true, active: false, time: "12 May, 2:00 PM" },
      { label: "Shipped", done: true, active: false, time: "13 May, 8:00 AM" },
      { label: "Out for Delivery", done: false, active: true, time: "Expected today" },
      { label: "Delivered", done: false, active: false, time: "—" },
    ],
  },
  "ADW-2024-002": {
    status: "Delivered",
    customer: "Ama Boateng",
    items: ["Raw Shea Butter 500g"],
    placed: "10 May 2024",
    eta: "12 May 2024",
    steps: [
      { label: "Order Placed", done: true, active: false, time: "10 May, 11:00 AM" },
      { label: "Payment Confirmed", done: true, active: false, time: "10 May, 11:05 AM" },
      { label: "Processing", done: true, active: false, time: "10 May, 3:00 PM" },
      { label: "Shipped", done: true, active: false, time: "11 May, 8:00 AM" },
      { label: "Out for Delivery", done: true, active: false, time: "12 May, 10:00 AM" },
      { label: "Delivered", done: true, active: false, time: "12 May, 2:30 PM" },
    ],
  },
};

export default function TrackOrderPage() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<typeof demoOrders[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setResult(null);
    await new Promise(r => setTimeout(r, 1200));
    const order = demoOrders[ref.trim().toUpperCase()];
    if (order) setResult(order);
    else setNotFound(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <StaticHeader />

      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="max-w-2xl mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse flex" />
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">Live Tracking</p>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Track Your <span className="text-pink-500">Order</span></h1>
          <p className="text-gray-500 text-lg mb-10">Enter your order reference number below to see real-time status updates.</p>

          <form onSubmit={handleTrack} className="flex gap-3 max-w-md mx-auto">
            <input
              type="text" value={ref} onChange={e => setRef(e.target.value)}
              placeholder="e.g. ADW-2024-001"
              className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 bg-white shadow-sm font-mono"
            />
            <button type="submit" disabled={loading || !ref.trim()}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-pink-200">
              {loading ? <Clock size={18} className="animate-spin" /> : <Search size={18} />}
              {loading ? "Tracking…" : "Track"}
            </button>
          </form>

          <p className="text-gray-400 text-xs mt-3">Try: ADW-2024-001 or ADW-2024-002 for demo</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          {notFound && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h3>
              <p className="text-gray-500">We couldn't find an order with reference <span className="font-mono font-bold">"{ref}"</span>. Please check the reference number on your confirmation email.</p>
              <a href="/contact" className="mt-4 inline-block text-pink-500 font-semibold hover:text-pink-600">Contact Support →</a>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Order Reference</p>
                    <p className="font-mono font-bold text-xl text-gray-800">{ref.toUpperCase()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${result.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {result.status === "Delivered" ? "✅ " : "🚚 "}{result.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div><span className="text-gray-400">Customer:</span> <span className="font-medium">{result.customer}</span></div>
                  <div><span className="text-gray-400">Placed:</span> <span className="font-medium">{result.placed}</span></div>
                  <div><span className="text-gray-400">ETA:</span> <span className="font-medium">{result.eta}</span></div>
                  <div><span className="text-gray-400">Items:</span> <span className="font-medium">{result.items.length}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Items</p>
                  {result.items.map(item => <p key={item} className="text-sm text-gray-700">• {item}</p>)}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Delivery Timeline</h3>
                <div className="space-y-0">
                  {result.steps.map((step, i) => (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.done ? "bg-green-500 text-white" :
                          step.active ? "bg-pink-500 text-white animate-pulse" :
                          "bg-gray-100 text-gray-400"
                        }`}>
                          {step.done ? <CheckCircle size={18} /> : step.active ? <Truck size={18} /> : <Package size={16} />}
                        </div>
                        {i < result.steps.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-green-300" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pb-6 flex-1">
                        <p className={`font-semibold text-sm ${step.done || step.active ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${step.done ? "text-green-600" : step.active ? "text-pink-500 font-semibold" : "text-gray-400"}`}>{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Need help with this order?</h3>
                  <p className="text-gray-500 text-sm">Our team is available Mon–Sat, 8 AM – 8 PM</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <a href="tel:+233240000000" className="flex items-center gap-2 bg-white border border-pink-300 text-pink-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-pink-50 transition-colors">
                    <Phone size={14} /> Call Us
                  </a>
                  <a href="/contact" className="flex items-center gap-2 bg-pink-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-pink-600 transition-colors">
                    <MapPin size={14} /> Contact
                  </a>
                </div>
              </div>
            </div>
          )}

          {!result && !notFound && !loading && (
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {[
                { icon: Package, title: "Order Placed", desc: "Receive your order confirmation email with your unique reference number.", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Truck, title: "In Transit", desc: "We'll notify you via SMS when your order is out for delivery.", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: CheckCircle, title: "Delivered", desc: "Enjoy your order! Rate your experience to help other shoppers.", color: "text-green-500", bg: "bg-green-50" },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-all">
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={22} className={color} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
