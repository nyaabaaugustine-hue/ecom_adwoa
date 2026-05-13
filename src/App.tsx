import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { ProductGrid } from "./components/ProductGrid";
import { Testimonials } from "./components/Testimonials";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { Cart } from "./components/Cart";
import { ProductModal } from "./components/ProductModal";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { User, login, hasPermission } from "./utils/auth";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentView, setCurrentView] = useState<'store' | 'dashboard'>('store');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('adwoas_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    const loggedInUser = login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('adwoas_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adwoas_user');
    setCurrentView('store');
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  // Show Login if trying to access dashboard without auth
  if (currentView === 'dashboard' && !isAuthenticated) {
    return <Login onLogin={handleLogin} onBack={() => setCurrentView('store')} />;
  }

  // Show Dashboard if authenticated and viewing dashboard
  if (currentView === 'dashboard' && isAuthenticated && user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        hasPermission={(permission) => hasPermission(user.role, permission)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        onDashboardClick={() => setCurrentView('dashboard')}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <Hero />
      <CategoryShowcase />
      <ProductGrid
        onProductClick={setSelectedProduct}
        onAddToCart={addToCart}
      />
      <Testimonials />
      <Newsletter />
      <Footer />

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}