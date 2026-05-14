"use client";
import { useState } from "react";
import { Search, Menu, User as UserIcon, ShoppingBag, Heart, X, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { User } from "../utils/auth";

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

  const categories = [
    { name: "Shop All", href: "/shop" },
    { name: "Fashion", href: "/fashion" },
    { name: "Cosmetics", href: "/cosmetics" },
    { name: "Skincare", href: "/skincare" },
    { name: "Hair Care", href: "/shop" },
    { name: "Accessories", href: "/shop" },
    { name: "Sale", href: "/shop", highlight: true },
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
          <a href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-pink-200 transition-shadow">
                <span className="text-white font-serif text-xl font-bold">A</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full overflow-hidden border-2 border-white">
                <div className="h-1/3 bg-red-600" />
                <div className="h-1/3 bg-yellow-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-black" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}} />
                </div>
                <div className="h-1/3 bg-green-600" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-serif font-bold text-gray-900 leading-none tracking-tight">Adwoa&apos;s</h1>
              <p className="text-[9px] text-pink-400 uppercase tracking-[0.2em] font-semibold mt-0.5">Beauty &amp; Fashion</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={(cat as any).href}
                className={`text-sm font-medium transition-colors relative group/link ${
                  (cat as any).highlight ? "text-pink-500 font-bold" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {cat.name}
                {!(cat as any).highlight && (
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-pink-400 group-hover/link:w-full transition-all duration-300" />
                )}
                {(cat as any).highlight && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded uppercase">HOT</span>
                )}
              </a>
            ))}
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
            {categories.map((cat) => (
              <a key={cat.name} href={(cat as any).href}
                className={`px-6 py-3.5 text-sm font-medium flex items-center justify-between ${
                  (cat as any).highlight ? "text-pink-500 font-bold" : "text-gray-700 hover:text-pink-500 hover:bg-pink-50"
                } transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
                {(cat as any).highlight && (
                  <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">HOT</span>
                )}
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
