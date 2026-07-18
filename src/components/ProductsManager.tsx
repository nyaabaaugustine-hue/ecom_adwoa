"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Package, AlertCircle, Loader2, Upload } from "lucide-react";
import { SafeImage } from "./SafeImage";
import { fetchProducts, createProductApi, updateProductApi, deleteProductApi, authHeaders, type Product } from "../lib/store-api";

interface ProductsManagerProps {
  hasPermission: (permission: string) => boolean;
}

const CATEGORIES = ['all', 'Fashion', 'Cosmetics', 'Skincare', 'Hair Care', 'Accessories'];

type FormState = { name: string; brand: string; category: string; price: string; originalPrice: string; stock: string; image: string; badge: string; description: string };
const EMPTY_FORM: FormState = { name: "", brand: "", category: "Fashion", price: "", originalPrice: "", stock: "0", image: "", badge: "", description: "" };

export function ProductsManager({ hasPermission }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProducts().then(setProducts).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (categoryFilter === 'all' || product.category === categoryFilter);
  });

  const openAddModal = () => { if (!hasPermission('manage_products')) return; setEditingId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEditModal = (product: Product) => {
    if (!hasPermission('manage_products')) return;
    setEditingId(product.id);
    setForm({ name: product.name, brand: product.brand, category: product.category, price: String(product.price), originalPrice: product.originalPrice != null ? String(product.originalPrice) : "", stock: String(product.stock), image: product.image ?? "", badge: product.badge ?? "", description: product.description ?? "" });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.price.trim()) { setError("Name, brand and price are required."); return; }
    setSaving(true); setError("");
    try {
      const payload: Partial<Product> = { name: form.name.trim(), brand: form.brand.trim(), category: form.category, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, stock: form.stock ? Number(form.stock) : 0, image: form.image.trim() || undefined, badge: form.badge.trim() || undefined, description: form.description.trim() };
      if (editingId) { await updateProductApi(editingId, payload); } else { await createProductApi(payload); }
      setShowModal(false); load();
    } catch (err: any) { setError(err.message || "Failed to save product."); } finally { setSaving(false); }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try { await deleteProductApi(product.id); setProducts((prev) => prev.filter((p) => p.id !== product.id)); } catch (err: any) { setError(err.message || "Failed to delete product."); } finally { setDeletingId(null); }
  };

  const inStockCount = products.filter(p => (p.stock ?? 0) > 10).length;
  const lowStockCount = products.filter(p => Number(p.stock ?? 0) <= 10 && Number(p.stock ?? 0) > 0).length;
  const outOfStockCount = products.filter(p => Number(p.stock ?? 0) === 0).length;

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center justify-between mb-6">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Products Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
        </div>
        {hasPermission('manage_products') && (
          <button onClick={openAddModal} className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-gray-800">{products.length}</p><p className="text-sm text-gray-500">Total Products</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-green-600">{inStockCount}</p><p className="text-sm text-gray-500">In Stock</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p><p className="text-sm text-gray-500">Low Stock</p></div>
        <div className="bg-white rounded-xl p-4 border border-gray-100"><p className="text-2xl font-bold text-red-600">{outOfStockCount}</p><p className="text-sm text-gray-500">Out of Stock</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
            {CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 size={28} className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
              <div className="relative aspect-square bg-gray-50">
                <SafeImage src={product.image} alt={product.name} fill className="object-cover" />
                {product.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${product.badge === 'Sale' ? 'bg-red-500 text-white' : product.badge === 'New' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>{product.badge}</span>
                )}
                {(product.stock ?? 0) === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="bg-white px-3 py-1 rounded text-sm font-medium text-gray-800">Out of Stock</span></div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedProduct(product)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-50"><Eye size={18} className="text-gray-600" /></button>
                    {hasPermission('manage_products') && (
                      <>
                        <button onClick={() => openEditModal(product)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-50"><Edit size={18} className="text-gray-600" /></button>
                        <button onClick={() => handleDelete(product)} disabled={deletingId === product.id} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50">{deletingId === product.id ? <Loader2 size={18} className="animate-spin text-red-500" /> : <Trash2 size={18} className="text-red-500" />}</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase">{product.brand}</p>
                <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-pink-500 font-medium">GHc{product.price}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${(product.stock ?? 0) > 10 ? 'bg-green-100 text-green-600' : (product.stock ?? 0) > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">No products found</p>
        </div>
      )}

      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedProduct(null)} />
          <div className="fixed inset-4 md:inset-20 bg-white rounded-xl z-50 overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Product Details</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">✕</button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
                <SafeImage src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm text-pink-500 font-medium">{selectedProduct.category}</p>
                <h3 className="text-xl font-medium text-gray-800 mt-1 mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{selectedProduct.description || "No description available."}</p>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500">Brand</span><span className="text-gray-800 font-medium">{selectedProduct.brand}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="text-gray-800 font-medium">GHc{selectedProduct.price}</span></div>
                  {selectedProduct.originalPrice && <div className="flex justify-between"><span className="text-gray-500">Original Price</span><span className="text-gray-400 line-through">GHc{selectedProduct.originalPrice}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Stock</span><span className={`font-medium ${(selectedProduct.stock ?? 0) > 10 ? 'text-green-600' : 'text-yellow-600'}`}>{selectedProduct.stock ?? 0} units</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rating</span><span className="text-gray-800 font-medium">{selectedProduct.rating}/5</span></div>
                </div>
                {hasPermission('manage_products') && (
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => { const p = selectedProduct; setSelectedProduct(null); openEditModal(p); }} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg text-sm">Edit Product</button>
                    <button onClick={() => { const p = selectedProduct; setSelectedProduct(null); handleDelete(p); }} className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm">Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-xl z-50 overflow-auto shadow-2xl max-h-[90vh]">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Enter product name" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label><input type="text" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Enter brand name" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">{CATEGORIES.filter(c => c !== 'all').map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Badge</label><select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"><option value="">None</option><option value="New">New</option><option value="Sale">Sale</option><option value="Bestseller">Bestseller</option><option value="Popular">Popular</option></select></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Price (GHc) *</label><input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="0.00" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label><input type="number" step="0.01" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Optional" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label><input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="0" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 mb-2"
                        placeholder="Or paste image URL" />
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 transition-colors text-sm text-gray-500">
                        <Upload size={16} />
                        <span>{imageFile ? imageFile.name : "Upload image from computer"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setImageFile(f);
                          setImagePreview(URL.createObjectURL(f));
                          setUploadingImage(true);
                          const fd = new FormData();
                          fd.append("file", f);
                          try { const res = await fetch("/api/upload", { method: "POST", headers: authHeaders(), body: fd }); const data = await res.json(); if (!res.ok) { setError(data.error || "Image upload failed."); return; } if (data.url) setForm((prev) => ({ ...prev, image: data.url })); }
                          catch { setError("Image upload failed."); } finally { setUploadingImage(false); }
                        }} />
                      </label>
                      {uploadingImage && <p className="text-xs text-pink-500 mt-1 flex items-center gap-1"><Loader2 size={12} className="animate-spin" />Uploading...</p>}
                    </div>
                    {(imagePreview || form.image) && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                        <img src={imagePreview || form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Enter product description" /></div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-lg text-sm font-medium flex items-center gap-2">{saving && <Loader2 size={14} className="animate-spin" />}{editingId ? "Save Changes" : "Add Product"}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}