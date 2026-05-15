"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X, Loader, CheckCircle, AlertCircle, ChevronLeft, Copy, Check, Shield,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CheckoutModalProps {
  isOpen: boolean;
  items: any[];
  total: number;
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

type PaymentMethod = "card" | "momo_mtn" | "momo_telecel" | "momo_at" | null;
type PaymentStep = "form" | "method" | "payment" | "success" | "error";

const TEST_CARD = { number: "4084 0843 6020 0522", expiry: "01/99", cvv: "408", pin: "0000", otp: "123456" };
const TEST_MOMO = { number: "0551234987", otp: "123456" };

const PAYMENT_METHODS = [
  {
    id: "momo_mtn",
    label: "MTN Mobile Money",
    subtitle: "Pay instantly with MoMo",
    logo: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/mtn_fb2z77.jpg",
    bg: "#FFF8E1",
    border: "#FBC02D",
    accent: "#F57F17",
  },
  {
    id: "momo_telecel",
    label: "Telecel Cash",
    subtitle: "Pay with Telecel / Vodafone Cash",
    logo: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/telecel_qpjsan.png",
    bg: "#FFEBEE",
    border: "#EF5350",
    accent: "#B71C1C",
  },
  {
    id: "momo_at",
    label: "AirtelTigo Money",
    subtitle: "Pay with AirtelTigo mobile wallet",
    logo: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/airteltigo_egkalj.jpg",
    bg: "#E3F2FD",
    border: "#1976D2",
    accent: "#0D47A1",
  },
  {
    id: "card",
    label: "Card Payment",
    subtitle: "Visa / Mastercard accepted",
    logos: [
      { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721235/visa_rgiuko.png", alt: "Visa", w: 52, h: 18 },
      { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721235/masetercard_eldi1v.png", alt: "Mastercard", w: 40, h: 24 },
    ],
    bg: "#F3F4F6",
    border: "#6366F1",
    accent: "#4338CA",
  },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for PWA/older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <button onClick={handleCopy} title="Copy" className="ml-2 text-gray-400 hover:text-pink-500 transition-colors">
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

function CredentialRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`flex items-center gap-1 ${mono ? "font-mono" : ""} text-gray-800 text-xs font-semibold`}>
        {value}<CopyButton text={value} />
      </span>
    </div>
  );
}

export function CheckoutModal({ isOpen, items, total, onClose, onSuccess }: CheckoutModalProps) {
  const router = useRouter();
  const { clearCart } = useCart();

  const [step, setStep] = useState<PaymentStep>("form");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [momoPhone, setMomoPhone] = useState(TEST_MOMO.number);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", notes: "" });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!formData.email.trim() || !formData.email.includes("@")) return "Please enter a valid email.";
    if (!formData.phone.trim()) return "Please enter your phone number.";
    if (!formData.address.trim()) return "Please enter your delivery address.";
    return null;
  };

  const handleProceedToMethod = () => {
    const err = validateForm();
    if (err) { setError(err); return; }
    setError("");
    setStep("method");
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError("");
    setStep("payment");
  };

  const getPaystackChannels = () => {
    if (paymentMethod === "card") return ["card"];
    return ["mobile_money"];
  };

  const loadPaystackScript = async (): Promise<void> => {
    if ((window as any).PaystackPop) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Could not load payment script. Check your connection."));
      document.head.appendChild(script);
    });
  };

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const initRes = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, phone: paymentMethod !== "card" ? momoPhone : formData.phone, address: formData.address, items, total }),
      });
      if (!initRes.ok) { const b = await initRes.json().catch(() => ({})); throw new Error(b.error || "Could not create order."); }
      const { reference: ref } = await initRes.json();
      setReference(ref);

      // Ensure Paystack script is loaded (handles PWA standalone mode)
      try {
        await loadPaystackScript();
      } catch {
        throw new Error("Payment script failed to load. Please check your connection and try again.");
      }

      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) throw new Error("Payment system not ready. Please refresh and try again.");
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
      if (!publicKey || publicKey.includes("CHANGE_ME")) throw new Error("Paystack public key not configured.");
      setLoading(false);

      PaystackPop.setup({
        key: publicKey, email: formData.email, amount: Math.round(total * 100), currency: "GHS", ref,
        channels: getPaystackChannels(),
        metadata: { custom_fields: [{ display_name: "Customer Name", variable_name: "customer_name", value: formData.name }] },
        callback: async (tx: { reference: string }) => {
          await fetch(`/api/payment/verify?reference=${tx.reference}&popup=true`).catch(() => {});
          setStep("success"); setReference(tx.reference); clearCart();
          setTimeout(() => { onSuccess(tx.reference); router.push(`/checkout/success?ref=${tx.reference}`); handleClose(); }, 2000);
        },
        onClose: () => { setLoading(false); setError("Payment cancelled. Try again whenever you're ready."); },
      }).openIframe();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Payment failed.");
      setStep("error");
    }
  };

  const handleClose = () => {
    if (loading) return;
    setStep("form"); setPaymentMethod(null);
    setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
    setMomoPhone(TEST_MOMO.number); setError(""); setReference("");
    onClose();
  };

  const stepOrder: PaymentStep[] = ["form", "method", "payment"];
  const currentStepIndex = stepOrder.indexOf(step);
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);
  const isMomo = paymentMethod && paymentMethod !== "card";

  return (
    <>
      <div className="fixed inset-0 bg-black/65 z-50 backdrop-blur-sm" onClick={handleClose} />

      <div className="fixed inset-2 md:inset-12 lg:inset-20 xl:inset-28 bg-white z-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ maxWidth: 680, margin: "auto" }}>

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          {/* Step back button */}
          {step === "method" && (
            <button onClick={() => setStep("form")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step === "payment" && (
            <button onClick={() => { setError(""); setStep("method"); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {!["method", "payment"].includes(step) && <div />}

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h2 className="text-base font-bold text-gray-900">
              {step === "form" && "Your Details"}
              {step === "method" && "Choose Payment"}
              {step === "payment" && "Confirm & Pay"}
              {step === "success" && "Order Placed!"}
              {step === "error" && "Payment Failed"}
            </h2>
            {["form", "method", "payment"].includes(step) && (
              <p className="text-[11px] text-gray-400 mt-0.5">Step {currentStepIndex + 1} of 3</p>
            )}
          </div>

          <button onClick={handleClose} disabled={loading} className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        {["form", "method", "payment"].includes(step) && (
          <div className="flex h-1 shrink-0">
            {stepOrder.map((s, i) => (
              <div key={s} className="flex-1 transition-all duration-500" style={{ background: i <= currentStepIndex ? "var(--color-primary, #ec4899)" : "#f3f4f6" }} />
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Order summary (shown during active steps) */}
          {["form", "method", "payment"].includes(step) && (
            <div className="mx-6 mt-5 mb-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Summary</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate pr-3">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-semibold text-gray-800 shrink-0">GHc{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-lg" style={{ color: "var(--color-primary,#ec4899)" }}>GHc{total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="px-6 py-5">

            {/* FORM STEP */}
            {step === "form" && (
              <div className="space-y-4">
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Adwoa Mensah" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Phone Number", name: "phone", type: "tel", placeholder: "0XX XXX XXXX" },
                  { label: "Delivery Address", name: "address", type: "text", placeholder: "Street, Area, City (e.g. Madina, Accra)" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label} <span className="text-red-400">*</span></label>
                    <input type={type} name={name} value={(formData as any)[name]} onChange={handleInputChange} placeholder={placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-sm transition-all bg-gray-50 focus:bg-white"
                      style={{ "--tw-ring-color": "var(--color-primary,#ec4899)" } as any}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Notes <span className="text-gray-300">(optional)</span></label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} placeholder="Special delivery instructions…"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-sm resize-none bg-gray-50 focus:bg-white"
                  />
                </div>
                {error && <ErrorBanner message={error} />}
              </div>
            )}

            {/* METHOD STEP */}
            {step === "method" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">Select your preferred payment method:</p>
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id as PaymentMethod)}
                    className="w-full rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group"
                    style={{ background: method.bg, border: `2px solid ${method.border}33` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Logo(s) */}
                      <div className="flex items-center gap-2 w-24 shrink-0">
                        {"logo" in method ? (
                          <div className="w-20 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-sm">
                            <Image src={method.logo} alt={method.label} width={72} height={40} className="object-contain w-full h-full" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-white rounded-xl px-2 py-1.5 shadow-sm">
                            {method.logos.map((l) => (
                              <Image key={l.alt} src={l.src} alt={l.alt} width={l.w} height={l.h} className="object-contain" style={{ height: 22, width: "auto" }} />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900">{method.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{method.subtitle}</p>
                      </div>

                      <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all group-hover:border-current shrink-0" style={{ borderColor: method.border }}>
                        <div className="w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: method.accent }} />
                      </div>
                    </div>
                  </button>
                ))}

                {/* Secure badge */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Shield size={13} className="text-green-500" />
                  <span className="text-xs text-gray-400 font-medium">256-bit SSL encrypted • Powered by Paystack</span>
                </div>
              </div>
            )}

            {/* PAYMENT STEP */}
            {step === "payment" && (
              <div className="space-y-4">
                {/* Selected method banner */}
                {selectedMethod && (
                  <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: selectedMethod.bg, border: `1.5px solid ${selectedMethod.border}44` }}>
                    {"logo" in selectedMethod ? (
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                        <Image src={selectedMethod.logo} alt={selectedMethod.label} width={60} height={36} className="object-contain w-full h-full" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 shadow-sm shrink-0">
                        {selectedMethod.logos.map((l) => (
                          <Image key={l.alt} src={l.src} alt={l.alt} width={l.w} height={l.h} className="object-contain" style={{ height: 20, width: "auto" }} />
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-gray-900">{selectedMethod.label}</p>
                      <p className="text-xs text-gray-500">{selectedMethod.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Test mode notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold text-amber-700 mb-0.5">🧪 Test Mode — no real charge</p>
                  <p className="text-xs text-amber-600">Use the credentials below in the Paystack popup.</p>
                </div>

                {/* Card credentials */}
                {paymentMethod === "card" && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Test Card Details</p>
                    <CredentialRow label="Card Number" value={TEST_CARD.number} mono />
                    <CredentialRow label="Expiry" value={TEST_CARD.expiry} mono />
                    <CredentialRow label="CVV" value={TEST_CARD.cvv} mono />
                    <CredentialRow label="PIN" value={TEST_CARD.pin} mono />
                    <CredentialRow label="OTP" value={TEST_CARD.otp} mono />
                  </div>
                )}

                {/* MoMo phone + credentials */}
                {isMomo && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                      <input type="tel" value={momoPhone} onChange={(e) => setMomoPhone(e.target.value)} placeholder="05X XXX XXXX"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-sm bg-gray-50 focus:bg-white" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Test Credentials</p>
                      <CredentialRow label="Test Number" value={TEST_MOMO.number} mono />
                      <CredentialRow label="OTP (when prompted)" value={TEST_MOMO.otp} mono />
                    </div>
                  </div>
                )}

                {error && <ErrorBanner message={error} />}
              </div>
            )}

            {/* SUCCESS */}
            {step === "success" && (
              <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={44} className="text-green-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
                <p className="text-gray-500 text-sm">Ref: <span className="font-mono font-bold text-gray-800">{reference}</span></p>
                <p className="text-xs text-gray-400 animate-pulse">Redirecting to your order confirmation…</p>
              </div>
            )}

            {/* ERROR */}
            {step === "error" && (
              <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={44} className="text-red-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Payment Failed</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 shrink-0 flex gap-3">
          {step === "form" && (
            <>
              <button onClick={handleClose} className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold py-3.5 rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={handleProceedToMethod} className="flex-1 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:opacity-90 shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--color-primary,#ec4899), var(--color-primary-dark,#db2777))", boxShadow: "0 4px 16px var(--color-primary,#ec4899)44" }}>
                Continue →
              </button>
            </>
          )}
          {step === "payment" && (
            <button onClick={handlePay} disabled={loading}
              className="flex-1 text-white font-bold py-3.5 rounded-xl transition-all text-sm hover:opacity-90 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-2 shadow-lg"
              style={!loading ? { background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 16px #22c55e44" } : {}}>
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? "Creating order…" : `Pay GHc${total.toFixed(2)} securely`}
            </button>
          )}
          {step === "error" && (
            <>
              <button onClick={() => { setError(""); setStep("payment"); }} className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold py-3.5 rounded-xl text-sm">Try Again</button>
              <button onClick={handleClose} className="flex-1 text-white font-bold py-3.5 rounded-xl text-sm" style={{ background: "var(--color-primary,#ec4899)" }}>Close</button>
            </>
          )}
          {step === "success" && (
            <button onClick={handleClose} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl text-sm">Close</button>
          )}
        </div>
      </div>
    </>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
