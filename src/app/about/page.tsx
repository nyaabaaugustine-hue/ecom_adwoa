"use client";

import Image from "next/image";
import { Heart, Users, Truck, Leaf, Award, MapPin, Phone, Mail, ArrowRight, Star } from "lucide-react";
import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

const values = [
  { icon: Heart, title: "Made with Love", desc: "Every product is carefully curated to celebrate Ghanaian women's beauty and style.", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Leaf, title: "Natural & Organic", desc: "We prioritize natural ingredients — shea butter, cocoa, moringa — sourced from Ghanaian farmers.", color: "text-green-500", bg: "bg-green-50" },
  { icon: Users, title: "Community First", desc: "Supporting local artisans, weavers, and small businesses across all 16 regions of Ghana.", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Award, title: "Premium Quality", desc: "Strict quality control ensures every item meets the highest standards before it reaches you.", color: "text-amber-500", bg: "bg-amber-50" },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "5K+", label: "Products" },
  { value: "16", label: "Regions Served" },
  { value: "200+", label: "Artisan Partners" },
];

const team = [
  { name: "Adwoa Mensah", role: "Founder & CEO", emoji: "👑", desc: "Fashion designer with 15 years experience in Ghanaian textiles." },
  { name: "Kofi Asante", role: "Head of Sourcing", emoji: "🌿", desc: "Works directly with farmers and artisans across Northern Ghana." },
  { name: "Ama Boateng", role: "Creative Director", emoji: "✨", desc: "Former Vlisco designer bringing global trends to African fashion." },
  { name: "Kwame Osei", role: "Tech & Operations", emoji: "⚡", desc: "Builds the digital platform that connects you to Ghana's finest products." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header cartCount={0} onCartClick={() => {}} onDashboardClick={() => {}} isAuthenticated={false} user={null} onLogout={() => {}} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">Our Story</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Celebrating <span className="text-pink-500">Ghana's Beauty</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Founded in 2019 in Accra, Adwoa's Beauty was born from a simple belief — every Ghanaian woman deserves access to premium, authentic beauty and fashion products that celebrate her identity.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-serif font-bold text-pink-500 mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">A Story Born from <span className="text-pink-500">Passion</span></h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>It started in Adwoa Mensah's living room in Osu, Accra. A seamstress by training, she saw how difficult it was for women to find authentic Ghanaian fabric and beauty products — all in one trusted place.</p>
              <p>She began connecting local Kente weavers in the Volta Region with customers in Accra. Word spread. Orders came from Kumasi, Tamale, Cape Coast. Then from the diaspora — London, New York, Toronto.</p>
              <p>Today, Adwoa's Beauty is Ghana's fastest-growing women's marketplace, partnering with over 200 artisans, farmers, and small businesses to bring you the finest African fashion and beauty products — delivered to your door.</p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["🌸","🌺","💛","🌿"].map((e, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium">Trusted by 10,000+ women across Ghana</p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-pink-200/40">
              <img
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif"
                alt="Adwoa's Beauty — Authentic Ghanaian products"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-pink-50">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🇬🇭</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">100% Ghanaian</p>
                  <p className="text-xs text-gray-500">Proudly Made in Ghana</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-pink-500 text-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="white" />)}
              </div>
              <p className="font-bold text-sm">4.9 / 5 Stars</p>
              <p className="text-xs text-pink-100">Based on 5,000+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Our values guide every decision we make — from the products we carry to the artisans we partner with.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-gray-500 text-lg">The passionate people behind Adwoa's Beauty.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-4xl mx-auto mb-4 border-4 border-pink-100">{member.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-0.5">{member.name}</h3>
                <p className="text-pink-500 text-xs font-semibold uppercase tracking-wide mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to Discover Your Beauty?</h2>
          <p className="text-pink-100 text-lg mb-8">Join 10,000+ women who trust Adwoa's Beauty for authentic Ghanaian fashion and beauty products.</p>
          <a href="/" className="inline-flex items-center gap-2 bg-white text-pink-600 font-bold px-8 py-4 rounded-xl hover:bg-pink-50 transition-colors shadow-lg">
            Shop Now <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
