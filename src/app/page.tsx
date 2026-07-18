"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CategorySection } from "../components/CategorySection";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { ProductGrid } from "../components/ProductGrid";
import { PromoBanner } from "../components/PromoBanner";
import { Newsletter } from "../components/Newsletter";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { Cart } from "../components/Cart";
import { CheckoutModal } from "../components/CheckoutModal";
import { ProductModal } from "../components/ProductModal";
import { LoginModal } from "../components/LoginModal";
import { Dashboard } from "../components/Dashboard";
import { AdminPanel } from "../components/AdminPanel";
import { BrandsMarquee } from "../components/BrandsMarquee";
import { CartProvider, useCart } from "../context/CartContext";
import type { Product } from "../lib/store-api";
import { User, hasPermission } from "../utils/auth";

type Page = "home" | "dashboard" | "admin";

function CartToast({ onOpenCart, onClose }: { onOpenCart: () => void; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4 max-w-xs border border-white/10">
        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Item added! 🛍️</p>
          <button
            onClick={onOpenCart}
            className="text-pink-400 text-xs font-medium hover:text-pink-300 transition-colors mt-0.5"
          >
            View cart → top right corner
          </button>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function HomeContent() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showCartToast, setShowCartToast] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const firstAddRef = useRef(false);

  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddItem = (item: any) => {
    addItem(item);
    if (!firstAddRef.current) {
      firstAddRef.current = true;
      setShowCartToast(true);
    }
  };

  // Cart requests checkout: close cart, then open checkout modal
  const handleCheckoutRequest = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleLogin = (user: { email: string; name: string; role: string; }, token: string) => {
    const authUser: User = { email: user.email, name: user.name, role: user.role as User["role"] };
    setCurrentUser(authUser);
    localStorage.setItem("token", token);
    setLoginOpen(false);
    if (authUser.role === "admin" || authUser.role === "manager") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      setCurrentUser(null);
      setCurrentPage("home");
      setLoggingOut(false);
    }, 400);
  };

  const handleDashboardClick = () => {
    if (currentUser) {
      if (currentUser.role === "admin" || currentUser.role === "manager") {
        setCurrentPage("admin");
      } else {
        setCurrentPage("dashboard");
      }
    } else {
      setLoginOpen(true);
    }
  };

  if (currentPage === "admin" && currentUser) {
    return <AdminPanel user={currentUser} onLogout={handleLogout} />;
  }

  if (currentPage === "dashboard" && currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
        loggingOut={loggingOut}
        hasPermission={(permission: string) =>
          hasPermission(currentUser.role, permission)
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onDashboardClick={handleDashboardClick}
        isAuthenticated={!!currentUser}
        user={currentUser}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />
      <main>
        <Hero />
        <CategorySection />
        <BrandsMarquee />
        <FeaturedCarousel onAddToCart={handleAddItem} />
        <ProductGrid onProductClick={setSelectedProduct} onAddToCart={handleAddItem} />
        <PromoBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />

      {/* Cart — z-40, opens checkout via handleCheckoutRequest */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeItem}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckoutRequest}
      />

      {/* CheckoutModal — z-50, always above cart */}
      <CheckoutModal
        isOpen={checkoutOpen}
        items={cartItems}
        total={cartTotal}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={(ref) => {
          clearCart();
          setCheckoutOpen(false);
          router.push(`/checkout/success?ref=${ref}`);
        }}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddItem}
        />
      )}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />

      {showCartToast && (
        <CartToast
          onOpenCart={() => { setCartOpen(true); setShowCartToast(false); }}
          onClose={() => setShowCartToast(false)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
