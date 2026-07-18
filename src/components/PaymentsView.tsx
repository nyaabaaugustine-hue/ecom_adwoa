"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Banknote, CheckCircle, XCircle, Loader2 } from "lucide-react";

type PaymentMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  description: string;
  fee: string;
};

const DEFAULT_METHODS: PaymentMethod[] = [
  { id: "mtn", name: "MTN Mobile Money", icon: Smartphone, enabled: true, description: "Accept MTN MoMo from all networks", fee: "1.5%" },
  { id: "telecel", name: "Telecel Cash", icon: Smartphone, enabled: true, description: "Accept Telecel (Vodafone) Cash", fee: "1.5%" },
  { id: "airteltigo", name: "AirtelTigo Money", icon: Smartphone, enabled: true, description: "Accept AirtelTigo Money", fee: "1.5%" },
  { id: "visa", name: "Visa / Mastercard", icon: CreditCard, enabled: true, description: "Accept card payments via Paystack", fee: "2.5%" },
  { id: "cod", name: "Cash on Delivery", icon: Banknote, enabled: true, description: "Pay when order arrives (Accra & Kumasi only)", fee: "0%" },
];

export function PaymentsView() {
  const [methods, setMethods] = useState<PaymentMethod[]>(DEFAULT_METHODS);
  const [saving, setSaving] = useState<string | null>(null);

  const toggleMethod = (id: string) => {
    setSaving(id);
    setTimeout(() => {
      setMethods((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m));
      setSaving(null);
    }, 300);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-gray-800">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Configure payment methods and gateways.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{methods.filter(m => m.enabled).length}/{methods.length}</p>
          <p className="text-sm text-gray-500">Active Methods</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-green-600">Paystack</p>
          <p className="text-sm text-gray-500">Payment Gateway</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">SSL</p>
          <p className="text-sm text-gray-500">256-bit Encryption</p>
        </div>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.enabled ? "bg-pink-50" : "bg-gray-50"}`}>
                  <Icon size={22} className={method.enabled ? "text-pink-500" : "text-gray-400"} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{method.name}</h3>
                  <p className="text-xs text-gray-400">{method.description}</p>
                  <span className="text-xs text-gray-400">Fee: {method.fee}</span>
                </div>
              </div>
              <button onClick={() => toggleMethod(method.id)} disabled={saving === method.id}
                className={`relative w-14 h-7 rounded-full transition-colors ${method.enabled ? "bg-pink-500" : "bg-gray-200"} ${saving === method.id ? "opacity-50" : ""}`}>
                {saving === method.id ? (
                  <Loader2 size={14} className="animate-spin text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                ) : (
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${method.enabled ? "translate-x-7" : "translate-x-0.5"}`} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2">Payment Configuration</h3>
        <p className="text-sm text-amber-700 mb-3">Connect your Paystack account to start accepting real payments. Keys are stored in your environment variables.</p>
        <div className="text-sm text-amber-700 font-mono bg-amber-100/50 rounded-lg p-3">
          <p>NEXT_PUBLIC_PAYSTACK_KEY=your_public_key_here</p>
          <p>PAYSTACK_SECRET=your_secret_key_here</p>
        </div>
      </div>
    </div>
  );
}
