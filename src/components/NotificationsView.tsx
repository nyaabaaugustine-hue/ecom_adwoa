"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Loader2, Save } from "lucide-react";

type NotificationChannel = {
  id: string;
  label: string;
  icon: React.ElementType;
  events: { id: string; label: string; enabled: boolean }[];
};

const DEFAULT_CHANNELS: NotificationChannel[] = [
  {
    id: "email", label: "Email", icon: Mail,
    events: [
      { id: "order_confirmation", label: "Order Confirmation", enabled: true },
      { id: "shipping_update", label: "Shipping Update", enabled: true },
      { id: "delivery_confirmation", label: "Delivery Confirmation", enabled: true },
      { id: "password_reset", label: "Password Reset", enabled: true },
    ],
  },
  {
    id: "sms", label: "SMS", icon: Smartphone,
    events: [
      { id: "order_confirmation_sms", label: "Order Confirmation", enabled: true },
      { id: "shipping_update_sms", label: "Shipping Update", enabled: true },
      { id: "delivery_sms", label: "Delivery Notification", enabled: true },
      { id: "otp", label: "OTP Verification", enabled: true },
    ],
  },
  {
    id: "push", label: "Push Notifications", icon: Bell,
    events: [
      { id: "push_order", label: "Order Updates", enabled: false },
      { id: "push_promo", label: "Promotions & Deals", enabled: true },
      { id: "push_abandoned", label: "Abandoned Cart Reminder", enabled: false },
    ],
  },
];

export function NotificationsView() {
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [saving, setSaving] = useState(false);

  const toggleEvent = (channelId: string, eventId: string) => {
    setChannels((prev) => prev.map((ch) => ch.id === channelId ? {
      ...ch,
      events: ch.events.map((ev) => ev.id === eventId ? { ...ev, enabled: !ev.enabled } : ev),
    } : ch));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage notification channels and events.</p>
        </div>
        <button onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 500); }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const enabledCount = channel.events.filter((e) => e.enabled).length;
          return (
            <div key={channel.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                  <Icon size={20} className="text-pink-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{channel.label}</h3>
                  <p className="text-xs text-gray-400">{enabledCount}/{channel.events.length} events active</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {channel.events.map((ev) => (
                  <label key={ev.id} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm text-gray-700">{ev.label}</span>
                    <input type="checkbox" checked={ev.enabled} onChange={() => toggleEvent(channel.id, ev.id)}
                      className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4" />
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
