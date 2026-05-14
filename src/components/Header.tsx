"use client";
import { useState } from "react";
import Image from "next/image";
import { Search, Menu, User as UserIcon, ShoppingBag, Heart, X, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { User } from "../utils/auth";

const LOGO_URL =
  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778724509/logo_fxelgm.png";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onDashboardClick: () => void;
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

export function Header({
  cartCount,
  onCartClick,
  onDashboardClick,
  isAuthenticated,
  user,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Fashion", href: "/fashion" },
    { name: "Cosmetics", href: "/cosmetics" },
    { name: "Skincare", href: "/skincare" },
    { name: "Sale", href: "/shop", highlight: true },
  ];

  const pageLinks = [
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Track Order", href: "/track-order" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 p-2 hover:text-pink-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:shadow-pink-200 transition-shadow flex-shrink-0">
              <Image
                src={LOGO_URL}
                alt="Adwoa's Beauty & Fashion"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-serif font-bold text-gray-900 leading-none tracking-tight">Adwoa&apos;s</h1>
              <p className="text-[9px] text-pink-400 uppercase tracking-[0.2em] font-semibold mt-0.5">Beauty &amp; Fashion</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-wrap" aria-label="Main navigation">
            {primaryLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group/link ${
                  link.highlight ? "text-pink-500 font-bold" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
                {!link.highlight && (
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-pink-400 group-hover/link:w-full transition-all duration-300" />
                )}
                {link.highlight && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase">HOT</span>
                )}
              </a>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                aria-expanded={moreOpen}
                aria-controls="more-menu"
              >
                More
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {moreOpen && (
                <div id="more-menu" className="absolute right-0 mt-3 w-52 rounded-3xl border border-gray-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5">
                  <div className="py-2">
                    {pageLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-500 hover:text-pink-500 transition-colors p-2.5 rounded-full hover:bg-pink-50" aria-label="Search">
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button className="text-gray-500 hover:text-pink-500 transition-colors p-2.5 hidden sm:flex rounded-full hover:bg-pink-50" aria-label="Wishlist">
              <Heart size={20} />
            </button>

            {isAuthenticated && user ? (
              <div className="relative group hidden sm:block">
                <button onClick={onDashboardClick} className="flex items-center gap-1.5 text-gray-600 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-pink-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={13} className="text-gray-400" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
                  </div>
                  <button onClick={onDashboardClick} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-pink-500 transition-colors">
                    <LayoutDashboard size={15} /> Dashboard
                  </button>
                  <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={onDashboardClick} className="text-gray-500 hover:text-pink-500 transition-colors p-2.5 hidden sm:flex rounded-full hover:bg-pink-50" aria-label="Sign in">
                <UserIcon size={20} />
              </button>
            )}

            <button onClick={onCartClick} className="relative text-gray-500 hover:text-pink-500 transition-colors p-2.5 rounded-full hover:bg-pink-50" aria-label={`Shopping cart, ${cartCount} items`}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-pink-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search for Ankara, Kente, Shea Butter, Skincare..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 text-sm transition-all bg-gray-50 focus:bg-white"
                autoFocus />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col py-2">
            <div className="px-6 py-3 text-xs uppercase tracking-[0.3em] text-gray-400">Browse</div>
            {primaryLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-6 py-3.5 text-sm font-medium flex items-center justify-between ${
                  link.highlight ? "text-pink-500 font-bold" : "text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                } transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
                {link.highlight && (
                  <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">HOT</span>
                )}
              </a>
            ))}

            <div className="px-6 py-3 text-xs uppercase tracking-[0.3em] text-gray-400">More pages</div>
            {pageLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-6 py-3.5 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <div className="border-t border-gray-100 px-6 pt-4 pb-3 flex flex-col gap-2 mt-1">
              {isAuthenticated && user ? (
                <>
                  <button onClick={() => { onDashboardClick(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-600 font-medium py-2">
                    <LayoutDashboard size={16} /> Dashboard ({user.name})
                  </button>
                  <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-red-500 font-medium py-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { onDashboardClick(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-sm text-gray-600 font-medium py-2">
                  <UserIcon size={16} /> Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
