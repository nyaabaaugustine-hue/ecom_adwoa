"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { fetchShippingZonesApi, createShippingZoneApi, type ShippingZoneRow } from "../lib/store-api";

export function ShippingView() {
  const [zones, setZones] = useState<ShippingZoneRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ShippingZoneRow | null>(null);
  const [form, setForm] = useState({ name: "", regions: "", baseRate: "", freeThreshold: "", estimatedDays: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShippingZonesApi()
      .then(setZones)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const regions = form.regions.split(",").map((r) => r.trim()).filter(Boolean);
      const created = await createShippingZoneApi({
        name: form.name,
        regions,
        baseRate: parseFloat(form.baseRate),
        freeThreshold: form.freeThreshold ? parseFloat(form.freeThreshold) : null,
        estimatedDays: form.estimatedDays || null,
      });
      if (editing) {
        setZones((prev) => prev.map((z) => z.id === editing.id ? created : z));
      } else {
        setZones((prev) => [...prev, { ...created, regions: created.regions || form.regions }]);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", regions: "", baseRate: "", freeThreshold: "", estimatedDays: "" });
    } catch {}
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-gray-400"><Loader2 size={28} className="animate-spin" /></div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Shipping</h1>
          <p className="text-gray-500 text-sm mt-1">Manage shipping zones and rates.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: "", regions: "", baseRate: "", freeThreshold: "", estimatedDays: "" }); setShowForm(true); }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex gap-2">
          <Plus size={16} /> Add Zone
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-gray-800">{zones.length}</p><p className="text-sm text-gray-500">Shipping Zones</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-green-600">{zones.filter(z => z.active).length}</p><p className="text-sm text-gray-500">Active</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-pink-500">GHc{Math.min(...zones.map(z => parseFloat(z.baseRate)))}</p><p className="text-sm text-gray-500">Lowest Rate</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Base Rate</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Free Above</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {zones.map((z) => (
              <tr key={z.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><span className="text-sm font-medium text-gray-800">{z.name}</span></td>
                <td className="px-6 py-4"><span className="text-sm font-medium">GHc{z.baseRate}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600">{z.freeThreshold ? `GHc${z.freeThreshold}` : "—"}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600">{z.estimatedDays || "—"} days</span></td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${z.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>{z.active ? "Active" : "Disabled"}</span></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(z); const r = z.regions ? (typeof z.regions === "string" && z.regions.includes(",") ? z.regions : JSON.parse(z.regions as string).join(", ")) : ""; setForm({ name: z.name, regions: r, baseRate: z.baseRate, freeThreshold: z.freeThreshold || "", estimatedDays: z.estimatedDays || "" }); setShowForm(true); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-pink-500"><Edit size={16} /></button>
                    <button onClick={async () => { try { await fetch(`/api/admin/shipping`, { method: "DELETE", body: JSON.stringify({ id: z.id }), headers: { "Content-Type": "application/json" } }); setZones((prev) => prev.filter((x) => x.id !== z.id)); } catch {} }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">{editing ? "Edit Zone" : "Add Shipping Zone"}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Zone Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-300" placeholder="Accra Metro" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Covered Regions *</label>
                  <input required value={form.regions} onChange={(e) => setForm({ ...form, regions: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Accra, Tema, Ashaiman" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Rate *</label>
                    <input required type="number" min="0" step="0.5" value={form.baseRate} onChange={(e) => setForm({ ...form, baseRate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="15" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Free Above</label>
                    <input type="number" min="0" value={form.freeThreshold} onChange={(e) => setForm({ ...form, freeThreshold: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="200" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Est. Delivery</label>
                  <input value={form.estimatedDays} onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="2–4 days" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-lg text-sm font-medium flex gap-2">
                    {saving && <Loader2 size={14} className="animate-spin" />}{editing ? "Save" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
