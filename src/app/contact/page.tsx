"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle, Instagram, Facebook } from "lucide-react";
import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

const contactInfo = [
  { icon: MapPin, title: "Visit Us", lines: ["Oxford Street, Osu", "Accra, Ghana"], color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Phone, title: "Call Us", lines: ["+233 24 000 0000", "+233 20 000 0000"], color: "text-green-500", bg: "bg-green-50" },
  { icon: Mail, title: "Email Us", lines: ["hello@adwoasbeauty.com", "support@adwoasbeauty.com"], color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Clock, title: "Opening Hours", lines: ["Mon – Sat: 8 AM – 8 PM", "Sunday: 10 AM – 6 PM"], color: "text-amber-500", bg: "bg-amber-50" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header cartCount={0} onCartClick={() => {}} onDashboardClick={() => {}} isAuthenticated={false} user={null} onLogout={() => {}} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 text-center overflow-hidden relative">
        <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse flex" />
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">Get in Touch</p>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Contact <span className="text-pink-500">Us</span></h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">We love hearing from you. Whether it's about an order, a product question, or just to say hello — we're here.</p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map(({ icon: Icon, title, lines, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:-translate-y-1 text-center">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                {lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-pink-500 font-semibold hover:text-pink-600 transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", name: "name", type: "text", placeholder: "Adwoa Mensah" },
                      { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label} *</label>
                        <input required type={f.type} value={(form as any)[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Subject *</label>
                    <input required type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder="What can we help you with?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us more…"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-pink-200">
                    {loading ? <span className="animate-pulse">Sending…</span> : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* Map + Social */}
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-72 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Oxford Street, Osu</h3>
                  <p className="text-gray-500 text-sm">Accra, Ghana</p>
                  <a href="https://maps.google.com/?q=Oxford+Street+Osu+Accra" target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-block text-pink-500 font-semibold text-sm hover:text-pink-600">
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 border border-pink-100">
                <h3 className="font-bold text-gray-900 mb-1">Chat with Us</h3>
                <p className="text-gray-500 text-sm mb-4">Follow us on social media for quick responses and exclusive deals.</p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: "Instagram", href: "#", color: "bg-gradient-to-br from-pink-500 to-purple-600" },
                    { icon: Facebook, label: "Facebook", href: "#", color: "bg-blue-600" },
                    { icon: MessageCircle, label: "WhatsApp", href: "#", color: "bg-green-500" },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <a key={label} href={href}
                      className={`flex items-center gap-2 ${color} text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity`}>
                      <Icon size={15} /> {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Frequently Asked</h3>
                {["How long does delivery take?", "Can I return an item?", "Do you ship outside Accra?"].map(q => (
                  <div key={q} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600 text-sm">{q}</span>
                    <a href="/faqs" className="text-pink-500 text-xs font-semibold hover:text-pink-600">View →</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
