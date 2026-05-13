"use client";

import { useState } from "react";
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
import { ProductModal } from "../components/ProductModal";
import { LoginModal } from "../components/LoginModal";
import { Dashboard } from "../components/Dashboard";
import { AdminPanel } from "../components/AdminPanel";
import { CartProvider, useCart } from "../context/CartContext";
import { products } from "../utils/products";
import { User, hasPermission } from "../utils/auth";

type Page = "home" | "dashboard" | "admin";

function HomeContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { items: cartItems, addItem, removeItem, updateQuantity } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setLoginOpen(false);
    if (user.role === "admin" || user.role === "manager") {
      setCurrentPage("admin");
    } else {
      setCurrentPage("dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("home");
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
      />
      <main>
        <Hero />
        <CategorySection />
        <FeaturedCarousel onAddToCart={addItem} />
        <ProductGrid onProductClick={setSelectedProduct} onAddToCart={addItem} />
        <PromoBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />

      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cartItems}
        onRemove={removeItem}
        onUpdateQuantity={updateQuantity}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addItem}
        />
      )}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
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
