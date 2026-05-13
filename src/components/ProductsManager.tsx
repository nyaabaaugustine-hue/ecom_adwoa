import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Package, AlertCircle } from "lucide-react";
import { SafeImage } from "./SafeImage";
import { products } from "../utils/products";

interface ProductsManagerProps {
  hasPermission: (permission: string) => boolean;
}

export function ProductsManager({ hasPermission }: ProductsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Fashion', 'Cosmetics', 'Skincare', 'Hair Care', 'Accessories'];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-medium text-gray-800">Products Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
        </div>
        {hasPermission('manage_products') && (
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          <p className="text-sm text-gray-500">Total Products</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 10).length}</p>
          <p className="text-sm text-gray-500">In Stock</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-yellow-600">{products.filter(p => Number(p.stock ?? 0) <= 10 && Number(p.stock ?? 0) > 0).length}</p>
          <p className="text-sm text-gray-500">Low Stock</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-red-600">{products.filter(p => Number(p.stock ?? 0) === 0).length}</p>
          <p className="text-sm text-gray-500">Out of Stock</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
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
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
            <div className="relative aspect-square bg-gray-50">
              <SafeImage
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
                  product.badge === 'Sale' ? 'bg-red-500 text-white' :
                  product.badge === 'New' ? 'bg-green-500 text-white' :
                  'bg-gray-800 text-white'
                }`}>
                  {product.badge}
                </span>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white px-3 py-1 rounded text-sm font-medium text-gray-800">Out of Stock</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-50"
                  >
                    <Eye size={18} className="text-gray-600" />
                  </button>
                  {hasPermission('manage_products') && (
                    <>
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-50">
                        <Edit size={18} className="text-gray-600" />
                      </button>
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50">
                        <Trash2 size={18} className="text-red-500" />
                      </button>
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
                <span className={`text-xs px-2 py-0.5 rounded ${
                  product.stock > 10 ? 'bg-green-100 text-green-600' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">No products found</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedProduct(null)} />
          <div className="fixed inset-4 md:inset-20 bg-white rounded-xl z-50 overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Product Details</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Trash2 size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <SafeImage
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-pink-500 font-medium">{selectedProduct.category}</p>
                <h3 className="text-xl font-medium text-gray-800 mt-1 mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{selectedProduct.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Brand</span>
                    <span className="text-gray-800 font-medium">{selectedProduct.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="text-gray-800 font-medium">GHc{selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stock</span>
                    <span className={`font-medium ${selectedProduct.stock > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedProduct.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rating</span>
                    <span className="text-gray-800 font-medium">{selectedProduct.rating}/5</span>
                  </div>
                </div>
                {hasPermission('manage_products') && (
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg text-sm">
                      Edit Product
                    </button>
                    <button className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}