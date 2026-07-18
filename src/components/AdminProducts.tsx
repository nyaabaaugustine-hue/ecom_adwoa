"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter, Download, Upload, Package, X, Loader2, ImageIcon } from "lucide-react";
import { SafeImage } from "./SafeImage";
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  authHeaders,
  type Product,
} from "../lib/store-api";

const CATEGORIES = ['Fashion', 'Cosmetics', 'Skincare', 'Hair Care', 'Accessories'];

type FormState = {
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  image: string;
  badge: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: "", brand: "", category: CATEGORIES[0], price: "", originalPrice: "",
  stock: "", image: "", badge: "", description: "",
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

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
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const stock = Number(product.stock ?? 0);
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && stock <= 10 && stock > 0) ||
                        (stockFilter === 'out' && stock === 0) ||
                        (stockFilter === 'instock' && stock > 10);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const toggleSelect = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
      stock: String(product.stock),
      image: product.image ?? "",
      badge: product.badge ?? "",
      description: product.description ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.price.trim()) {
      setError("Name, brand and price are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: Partial<Product> = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: form.stock ? Number(form.stock) : 0,
        image: form.image.trim() || undefined,
        badge: form.badge.trim() || undefined,
        description: form.description.trim(),
      };
      if (editingId) {
        await updateProductApi(editingId, payload);
      } else {
        await createProductApi(payload);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedProducts((prev) => prev.filter((p) => p !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Delete ${selectedProducts.length} selected product(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(selectedProducts.map((id) => deleteProductApi(id)));
      setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    } catch (err: any) {
      setError(err.message || "Failed to delete selected products.");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}><X size={16} /></button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{selectedProducts.length} selected</span>
            <button onClick={handleDeleteSelected} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete Selected</button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="all">All Stock Status</option>
            <option value="instock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-300"
                  />
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">GHc{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">GHc{product.originalPrice}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      Number(product.stock ?? 0) > 10 ? 'text-green-600' :
                      Number(product.stock ?? 0) > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      Number(product.stock ?? 0) > 10 ? 'bg-green-100 text-green-600' :
                      Number(product.stock ?? 0) > 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {Number(product.stock ?? 0) > 10 ? 'Active' : Number(product.stock ?? 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-pink-500"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 disabled:opacity-40"
                      >
                        {deletingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-xl z-50 overflow-auto shadow-2xl max-h-[90vh]">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                    <input
                      type="text" required value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                    <select
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      <option value="">None</option>
                      <option value="New">New</option>
                      <option value="Sale">Sale</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="Popular">Popular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (GHc) *</label>
                    <input
                      type="number" step="0.01" min="0" required value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                    <input
                      type="number" step="0.01" min="0" value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number" min="0" value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                      placeholder="0"
                    />
                  </div>
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
                          try {
                            const res = await fetch("/api/upload", { method: "POST", headers: authHeaders(), body: fd });
                            const data = await res.json();
                            if (!res.ok) { setError(data.error || "Image upload failed."); return; }
                            if (data.url) setForm((prev) => ({ ...prev, image: data.url }));
                          } catch { setError("Image upload failed."); } finally { setUploadingImage(false); }
                        }} />
                      </label>
                      {uploadingImage && <p className="text-xs text-pink-500 mt-1 flex items-center gap-1"><Loader2 size={12} className="animate-spin" />Uploading...</p>}
                    </div>
                    {(imagePreview || form.image) && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                        <img src={imagePreview || form.image} alt="Preview" className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter product description"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {editingId ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
