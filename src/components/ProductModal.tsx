import { useState } from "react";
import { SafeImage } from "./SafeImage";
import { X, Star, Heart, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-10 lg:inset-20 bg-white z-50 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
          <SafeImage
            src={product.image}
            alt={product.name}
            width={384} // max-h-96 is 384px, assuming aspect ratio 1:1 for now
            height={384}
            className="object-contain"
          />
          {product.badge && (
            <span
              className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium tracking-wide ${
                product.badge === "New"
                  ? "bg-pink-500 text-white"
                  : product.badge === "Sale"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            {product.brand}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-800 mb-4">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-pink-400 fill-pink-400"
                      : "text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-medium text-gray-800">
              GHc{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                GHc{product.originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-800 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-gray-400 text-sm">
                GHc{(quantity * product.price).toFixed(2)} total
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-4 text-sm tracking-wide rounded-md flex items-center justify-center gap-2"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-12 h-12 rounded-md flex items-center justify-center border transition-all ${
                isFavorite
                  ? "bg-pink-50 border-pink-200 text-pink-500"
                  : "border-gray-200 text-gray-400 hover:border-pink-200"
              }`}
            >
              <Heart
                size={20}
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center text-xs">🚚</span>
              <span>Free delivery in Accra & Kumasi</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center text-xs">⚡</span>
              <span>Same-day delivery available</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-6 h-6 bg-pink-50 rounded-full flex items-center justify-center text-xs">↩️</span>
              <span>Easy 30-day returns</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}