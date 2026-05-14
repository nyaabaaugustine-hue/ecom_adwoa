import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SafeImage } from "./SafeImage";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items?: any[];
  onRemove?: (id: number) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onCheckout?: () => void;
}

export function Cart({ isOpen, onClose, items = [], onRemove, onUpdateQuantity, onCheckout }: CartProps) {
  const total = (items ?? []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-gray-600" />
            <h2 className="text-lg font-medium text-gray-800">Shopping Cart</h2>
            <span className="bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full text-xs font-medium">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-pink-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Add some beautiful items to get started!
              </p>
              <button
                onClick={onClose}
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 text-sm rounded-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-50 rounded-lg p-3"
                >
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                    {item.brand && <p className="text-gray-400 text-xs">{item.brand}</p>}
                    <p className="text-pink-500 font-medium text-sm mt-1">
                      GHc{item.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => onRemove?.(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-1 bg-white rounded-md p-1">
                      <button
                        onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-white">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">GHc{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-pink-500 font-medium">FREE</span>
            </div>
            <div className="flex justify-between mb-4 pt-3 border-t border-gray-100">
              <span className="font-medium text-gray-800">Total</span>
              <span className="font-bold text-gray-800 text-lg">
                GHc{total.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={() => {
                onClose();
                onCheckout?.();
              }}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-4 text-sm tracking-wide rounded-md mb-2"
            >
              CHECKOUT
            </button>
            <p className="text-center text-gray-400 text-xs">
              Secure checkout with Mobile Money & Cards
            </p>
          </div>
        )}
      </div>
    </>
  );
}