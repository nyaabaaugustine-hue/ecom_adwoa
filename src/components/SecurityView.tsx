"use client";

import { useState } from "react";
import { Shield, Key, Eye, EyeOff, Users, AlertTriangle, Loader2, Save } from "lucide-react";

export function SecurityView() {
  const [settings, setSettings] = useState({
    twoFactor: false,
    emailVerification: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    requireSpecialChars: true,
    rateLimiting: true,
    ipWhitelist: "",
  });
  const [saving, setSaving] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Security</h1>
          <p className="text-gray-500 text-sm mt-1">Manage account security and access controls.</p>
        </div>
        <button onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 500); }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-green-600">High</p>
          <p className="text-sm text-gray-500">Security Level</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{settings.twoFactor ? "On" : "Off"}</p>
          <p className="text-sm text-gray-500">2FA Status</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">3</p>
          <p className="text-sm text-gray-500">Active Sessions</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Shield size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Authentication</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div><p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p><p className="text-xs text-gray-400">Require 2FA for admin accounts</p></div>
            <input type="checkbox" checked={settings.twoFactor} onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div><p className="text-sm font-medium text-gray-800">Email Verification</p><p className="text-xs text-gray-400">Require email verification for new accounts</p></div>
            <input type="checkbox" checked={settings.emailVerification} onChange={(e) => setSettings({ ...settings, emailVerification: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4" />
          </label>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (min)</label>
              <select value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
              <select value={settings.maxLoginAttempts} onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option value="3">3 attempts</option><option value="5">5 attempts</option><option value="10">10 attempts</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Key size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Password Policy</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Password Length</label>
              <select value={settings.passwordMinLength} onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
                <option value="6">6 characters</option><option value="8">8 characters</option><option value="12">12 characters</option><option value="16">16 characters</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <label className="flex items-center gap-3 cursor-pointer pt-2">
                <input type="checkbox" checked={settings.requireSpecialChars} onChange={(e) => setSettings({ ...settings, requireSpecialChars: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-300" />
                <span className="text-sm text-gray-700">Require special characters</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <AlertTriangle size={20} className="text-pink-500" />
          <h2 className="font-medium text-gray-800">Protection</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div><p className="text-sm font-medium text-gray-800">Rate Limiting</p><p className="text-xs text-gray-400">Protect API endpoints from brute force attacks</p></div>
            <input type="checkbox" checked={settings.rateLimiting} onChange={(e) => setSettings({ ...settings, rateLimiting: e.target.checked })}
              className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-pink-500 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4" />
          </label>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users size={20} className="text-red-500" />
          <h2 className="font-medium text-red-700">Admin Access Log</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-red-100">
            <span className="text-red-700">admin@adwoas.com</span>
            <span className="text-red-500">Logged in · Today 3:15 PM</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-red-100">
            <span className="text-red-700">manager@adwoas.com</span>
            <span className="text-red-500">Logged in · Today 2:30 PM</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-red-700">staff@adwoas.com</span>
            <span className="text-red-500">Failed attempt · Today 1:45 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
