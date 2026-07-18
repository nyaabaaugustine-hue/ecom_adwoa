"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: { email: string; name: string; role: string }, token: string) => void;
  prefillEmail?: string;
}

export function LoginModal({ open, onClose, onLogin, prefillEmail }: LoginModalProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open && prefillEmail) setEmail(prefillEmail);
  }, [open, prefillEmail]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Invalid email or password. Please try again.";
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setEmail("");
      setPassword("");
      onLogin(data.user, data.token);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-8 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>
            <div className="w-16 h-16 mx-auto mb-4">
              <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1784297096/adjologo_jhcfap.png" alt="Adwoa's Beauty" width={64} height={64} loading="lazy" className="w-16 h-16 object-contain brightness-0 invert" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-white">
              Welcome Back
            </h2>
            <p className="text-pink-100 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Demo Credentials */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">
                Demo Credentials
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Admin:</span>{" "}
                  admin@adwoas.com / admin123
                </p>
                <p>
                  <span className="font-medium text-gray-700">Manager:</span>{" "}
                  manager@adwoas.com / manager123
                </p>
                <p>
                  <span className="font-medium text-gray-700">Staff:</span>{" "}
                  staff@adwoas.com / staff123
                </p>
                <p>
                  <span className="font-medium text-gray-700">Customer:</span>{" "}
                  customer@adwoas.com / customer123
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 text-xs mt-5">
              Protected by role-based access control
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
