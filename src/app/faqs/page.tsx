"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Footer } from "../../components/Footer";
import { StaticHeader } from "../../components/StaticHeader";

const categories = ["All", "Orders & Delivery", "Returns", "Payments", "Products", "Account"];

const faqs = [
  { cat: "Orders & Delivery", q: "How long does delivery take?", a: "Standard delivery within Accra and Kumasi takes 2–3 business days. For other regions in Ghana, expect 3–5 business days. Express same-day delivery is available in Accra for orders placed before 12 PM." },
  { cat: "Orders & Delivery", q: "Is there a delivery fee?", a: "Delivery is FREE on all orders above GHc 200 within Accra. For orders below GHc 200, a flat fee of GHc 15 applies. Other regions have varying rates — you'll see the exact fee at checkout." },
  { cat: "Orders & Delivery", q: "Do you deliver outside Ghana?", a: "Yes! We ship to the UK, US, Canada, Germany, and other countries with large Ghanaian communities. International shipping rates and timelines are calculated at checkout." },
  { cat: "Orders & Delivery", q: "How do I track my order?", a: "Once your order ships, you'll receive an SMS and email with your tracking reference. You can also visit our Track Order page and enter your order reference number for real-time updates." },
  { cat: "Returns", q: "What is your return policy?", a: "We offer a 30-day return policy from the date of delivery. Items must be unused, in original condition, and in their original packaging. Perishable beauty items (opened skincare) cannot be returned for hygiene reasons." },
  { cat: "Returns", q: "How do I initiate a return?", a: "Contact our support team via email (support@adwoasbeauty.com) or call +233 24 000 0000 with your order reference. We'll arrange a free collection from your address within Accra and Kumasi." },
  { cat: "Returns", q: "When will I get my refund?", a: "Once we receive and inspect the returned item, your refund is processed within 3–5 business days. Mobile Money refunds are instant. Card refunds may take 5–10 business days depending on your bank." },
  { cat: "Payments", q: "What payment methods do you accept?", a: "We accept MTN Mobile Money, Telecel Cash (formerly Vodafone Cash), AirtelTigo Money, Visa, and Mastercard. All payments are secured by Paystack and 256-bit SSL encryption." },
  { cat: "Payments", q: "Is it safe to pay on your website?", a: "Absolutely. We use Paystack, Ghana's most trusted payment gateway, with PCI-DSS compliance and 256-bit SSL encryption. Your card and MoMo details are never stored on our servers." },
  { cat: "Payments", q: "Can I pay on delivery?", a: "Cash on delivery is available in Accra and Kumasi for orders up to GHc 500. Select 'Pay on Delivery' at checkout. Our delivery agent will collect payment when your order arrives." },
  { cat: "Products", q: "Are your African fabrics authentic?", a: "Yes! All our Kente, Ankara, and African print fabrics are sourced directly from certified Ghanaian weavers and manufacturers. We work with artisans in the Volta, Ashanti, and Brong-Ahafo regions." },
  { cat: "Products", q: "Are your beauty products safe for dark skin?", a: "Our products are specifically formulated and curated for African skin tones. We test all skincare for melanin-rich skin and include only certified natural ingredients. Check individual product pages for full ingredient lists." },
  { cat: "Products", q: "Do you offer plus sizes in fashion?", a: "Yes! Our fashion collection runs from XS to 5XL. Most of our Ankara and Kente pieces are also available in custom sizing — contact us with your measurements for a personalized fit." },
  { cat: "Account", q: "How do I create an account?", a: "Click the profile icon in the top navigation bar and select 'Create Account'. You can also sign up during checkout. An account lets you track orders, save favorites, and earn loyalty points." },
  { cat: "Account", q: "I forgot my password. What do I do?", a: "Click 'Login', then 'Forgot Password'. Enter your email address and we'll send a password reset link within 5 minutes. Check your spam folder if you don't see it." },
  { cat: "Account", q: "How do I earn loyalty points?", a: "You earn 1 point for every GHc 1 spent. Points can be redeemed for discounts on future purchases. Sign up for an account to start earning. Existing customers can retroactively link past orders." },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(f =>
    (activeCategory === "All" || f.cat === activeCategory) &&
    (f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <StaticHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 text-center overflow-hidden relative">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse flex" />
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">Help Center</p>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Frequently Asked <span className="text-pink-500">Questions</span></h1>
          <p className="text-gray-500 text-lg mb-8">Find quick answers to common questions about orders, delivery, returns, and more.</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No results for "{search}"</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-3 text-pink-500 font-semibold">Clear search</button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <button className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{faq.cat}</span>
                      <p className="font-semibold text-gray-900 mt-0.5">{faq.q}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openIndex === i ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {openIndex === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {openIndex === i && (
                    <div className="px-6 pb-5">
                      <div className="h-px bg-gray-100 mb-4" />
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Still have questions */}
          <div className="mt-12 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 text-center border border-pink-100">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Still have questions?</h3>
            <p className="text-gray-500 mb-6">Our friendly support team is ready to help you Mon–Sat, 8 AM–8 PM.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/contact" className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-pink-200">Contact Us</a>
              <a href="tel:+233240000000" className="border-2 border-pink-300 text-pink-600 font-bold px-6 py-3 rounded-xl hover:bg-pink-50 transition-colors">Call +233 24 000 0000</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
