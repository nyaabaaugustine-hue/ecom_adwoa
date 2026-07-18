"use client";

import { useState, useEffect } from "react";
import { Percent, Plus, Edit, Trash2, Tag, Loader2 } from "lucide-react";
import { fetchDiscountsApi, createDiscountApi, updateDiscountApi, deleteDiscountApi, type DiscountRow } from "../lib/store-api";

export function DiscountsView() {
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DiscountRow | null>(null);
  const [form, setForm] = useState({ code: "", type: "percentage" as "percentage" | "fixed", value: "", minOrder: "", maxUses: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDiscountsApi()
      .then(setDiscounts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateDiscountApi(editing.id, {
          code: form.code, type: form.type, value: parseFloat(form.value),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt,
        });
        setDiscounts((prev) => prev.map((d) => d.id === editing.id ? updated : d));
      } else {
        const created = await createDiscountApi({
          code: form.code, type: form.type, value: parseFloat(form.value),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt,
        });
        setDiscounts((prev) => [...prev, created]);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" });
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDiscountApi(id);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch {}
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-gray-400"><Loader2 size={28} className="animate-spin" /></div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Discounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage promo codes and discounts.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" }); setShowForm(true); }}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex gap-2">
          <Plus size={16} /> Add Discount
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-gray-800">{discounts.length}</p><p className="text-sm text-gray-500">Total Codes</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-green-600">{discounts.filter(d => d.active).length}</p><p className="text-sm text-gray-500">Active</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-pink-500">{discounts.reduce((s, d) => s + d.usedCount, 0)}</p><p className="text-sm text-gray-500">Total Uses</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><span className="font-mono font-bold text-sm">{d.code}</span></td>
                <td className="px-6 py-4"><span className="text-sm font-medium">{d.type === "percentage" ? `${d.value}%` : `GHc${d.value}`}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600">{d.usedCount}{d.maxUses ? `/${d.maxUses}` : ""}</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "—"}</span></td>
                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${d.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>{d.active ? "Active" : "Disabled"}</span></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(d); setForm({ code: d.code, type: d.type as any, value: String(d.value), minOrder: d.minOrder || "", maxUses: String(d.maxUses || ""), expiresAt: d.expiresAt ? d.expiresAt.split("T")[0] : "" }); setShowForm(true); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-pink-500"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
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
              <h2 className="text-xl font-semibold mb-6">{editing ? "Edit Discount" : "Add Discount"}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code *</label>
                  <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-pink-300" placeholder="SAVE20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-300">
                      <option value="percentage">%</option><option value="fixed">GHc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Value *</label>
                    <input required type="number" min="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Amount</label>
                    <input type="number" min="0" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Usage Limit</label>
                    <input type="number" min="1" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input type="date" required value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-300" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-lg text-sm font-medium flex items-center gap-2">
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
