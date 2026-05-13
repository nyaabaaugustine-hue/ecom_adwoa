import { useState } from "react";
import { Save, Bell, Shield, CreditCard, Truck, Store, Mail, Globe, Users } from "lucide-react";

export function SettingsView() {
  const [settings, setSettings] = useState({
    storeName: "Adwoa's Beauty Emporium",
    storeEmail: "hello@adwoasbeauty.com",
    storePhone: "+233 24 555 1234",
    currency: "GHS",
    language: "en",
    orderConfirmation: true,
    shippingNotifications: true,
    promotionalEmails: false,
    requireEmailVerification: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    freeShippingThreshold: "200",
    standardShippingRate: "25",
    expressShippingRate: "50",
  });

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {/* Store Settings */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Store size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Store Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="GHS">Ghana Cedi (GHS)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none"
                >
                  <option value="en">English</option>
                  <option value="tw">Twi</option>
                  <option value="ga">Ga</option>
                  <option value="ee">Ewe</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Bell size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-800">Order Confirmations</p>
              <p className="text-xs text-gray-400">Send email confirmations for new orders</p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderConfirmation}
              onChange={(e) => setSettings({ ...settings, orderConfirmation: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-800">Shipping Notifications</p>
              <p className="text-xs text-gray-400">Notify customers when orders are shipped</p>
            </div>
            <input
              type="checkbox"
              checked={settings.shippingNotifications}
              onChange={(e) => setSettings({ ...settings, shippingNotifications: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-800">Promotional Emails</p>
              <p className="text-xs text-gray-400">Send marketing emails to subscribers</p>
            </div>
            <input
              type="checkbox"
              checked={settings.promotionalEmails}
              onChange={(e) => setSettings({ ...settings, promotionalEmails: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4"
            />
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Shield size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Security</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-800">Email Verification</p>
              <p className="text-xs text-gray-400">Require email verification for new accounts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400">Add extra security to admin accounts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4"
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Truck size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Shipping</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold (GHc)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Rate (GHc)</label>
              <input
                type="number"
                value={settings.standardShippingRate}
                onChange={(e) => setSettings({ ...settings, standardShippingRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Express Shipping Rate (GHc)</label>
              <input
                type="number"
                value={settings.expressShippingRate}
                onChange={(e) => setSettings({ ...settings, expressShippingRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
        <div className="p-4 border-b border-red-100 flex items-center gap-3 bg-red-50">
          <Shield size={20} className="text-red-500" />
          <h2 className="font-medium text-red-700">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Delete All Products</p>
              <p className="text-xs text-gray-400">Permanently remove all products from your store</p>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">
              Delete All
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Reset Store</p>
              <p className="text-xs text-gray-400">Reset all settings to default values</p>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">
              Reset Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}