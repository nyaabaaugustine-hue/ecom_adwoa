"use client";
import { useState } from "react";
import { X, Star, Heart, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description?: string;
  stock?: number;
  category: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white z-50 overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-96 object-contain rounded-xl"
          />
          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full ${
                product.badge === "New"
                  ? "bg-pink-500 text-white"
                  : product.badge === "Sale"
                  ? "bg-red-500 text-white"
                  : product.badge === "Bestseller"
                  ? "bg-gray-800 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col">
          <p className="text-xs text-pink-500 uppercase tracking-widest font-semibold mb-2">
            {product.brand}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-800 mb-4 leading-tight">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-800">
              GHc{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  GHc{product.originalPrice}
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-gray-500 text-sm">
                GHc{(quantity * product.price).toFixed(2)} total
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 font-semibold py-4 text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              }`}
            >
              {added ? "✓ Added to Cart!" : "ADD TO CART"}
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                isFavorite
                  ? "bg-pink-50 border-pink-400 text-pink-500"
                  : "border-gray-200 text-gray-400 hover:border-pink-200 hover:text-pink-400"
              }`}
              aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Stock Indicator */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10
                    ? "bg-green-400"
                    : product.stock > 0
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
              />
              <span className="text-xs text-gray-500">
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
              </span>
            </div>
          )}

          {/* Delivery Info */}
          <div className="border-t border-gray-100 pt-5 space-y-3 mt-auto">
            {[
              { icon: "🚚", text: "Free delivery in Accra & Kumasi" },
              { icon: "⚡", text: "Same-day delivery available" },
              { icon: "↩️", text: "Easy 30-day returns" },
              { icon: "🔒", text: "Secure payment via MTN MoMo & Cards" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-7 h-7 bg-pink-50 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  {icon}
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
