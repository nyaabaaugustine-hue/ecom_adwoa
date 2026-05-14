"use client";

import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Footer } from "../../components/Footer";
import { StaticHeader } from "../../components/StaticHeader";
import { ArrowRight, Clock, User } from "lucide-react";

const posts = [
  {
    slug: "5-ways-to-style-ankara",
    category: "Fashion",
    title: "5 Ways to Style Your Ankara Fabric This Season",
    excerpt: "From casual brunch looks to formal events — discover how Ghanaian women are rocking Ankara in 2024 with modern twists on traditional prints.",
    image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    author: "Adwoa Mensah",
    date: "May 10, 2024",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "natural-skincare-routine",
    category: "Skincare",
    title: "The Ultimate Natural Skincare Routine for Ghanaian Women",
    excerpt: "Shea butter, baobab oil, moringa — these African superfoods are the secret to glowing skin. Here's how to build your natural skincare routine.",
    image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    author: "Ama Boateng",
    date: "May 5, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "kente-wedding-guide",
    category: "Fashion",
    title: "The Modern Bride's Guide to Kente Wedding Attire",
    excerpt: "Kente at weddings is a beautiful tradition. We spoke to 5 Ghanaian brides about how they incorporated Kente into their big day.",
    image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    author: "Adwoa Mensah",
    date: "April 28, 2024",
    readTime: "8 min read",
    featured: false,
  },
  {
    slug: "ghana-beauty-brands",
    category: "Cosmetics",
    title: "7 Ghanaian Beauty Brands You Need to Know",
    excerpt: "The local beauty industry is booming. From lip glosses to foundations made for African skin — these homegrown brands are changing the game.",
    image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    author: "Ama Boateng",
    date: "April 20, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    slug: "ankara-for-office",
    category: "Fashion",
    title: "How to Wear Ankara to the Office Without Raising Eyebrows",
    excerpt: "Corporate Ankara is having a moment. Here's how to balance professional dress codes with authentic African expression at work.",
    image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    author: "Kofi Asante",
    date: "April 14, 2024",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "shea-butter-benefits",
    category: "Skincare",
    title: "Why Shea Butter from Northern Ghana is the World's Best",
    excerpt: "The shea trees of the Savannah region produce some of the world's finest shea butter. We visited the cooperatives to find out why.",
    image: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778669947/lk_oyxxa6.avif",
    author: "Kofi Asante",
    date: "April 7, 2024",
    readTime: "9 min read",
    featured: false,
  },
];

const categories = ["All", "Fashion", "Skincare", "Cosmetics", "Lifestyle"];

export default function BlogPage() {
  const featured = posts.find(p => p.featured)!;
  const rest = posts.filter(p => !p.featured);

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
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">Stories & Style</p>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Adwoa&apos;s <span className="text-pink-500">Blog</span></h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Fashion tips, beauty secrets, and stories celebrating Ghanaian women&apos;s style and culture.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category filter */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {categories.map(c => (
              <button key={c} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${c === "All" ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
            ))}
          </div>

          {/* Featured post */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border border-gray-100 group cursor-pointer">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0 md:to-white" />
                <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">{featured.category}</span>
                <span className="absolute top-4 right-4 bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">✨ Featured</span>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><User size={12} /> {featured.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                  <span>{featured.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight group-hover:text-pink-500 transition-colors">{featured.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-pink-500 font-semibold text-sm group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <article key={post.slug} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-pink-500 transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-1 mt-4 text-pink-500 font-semibold text-xs group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={13} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-10 text-center text-white">
            <h2 className="text-3xl font-serif font-bold mb-3">Never Miss a Story</h2>
            <p className="text-pink-100 mb-6 max-w-md mx-auto">Get the latest fashion tips, beauty secrets, and exclusive deals delivered to your inbox weekly.</p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none" />
              <button className="bg-white text-pink-600 font-bold px-5 py-3 rounded-xl hover:bg-pink-50 transition-colors whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
