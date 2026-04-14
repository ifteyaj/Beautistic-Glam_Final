import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/EmptyState';
import type { Product } from '../types';
import { CATEGORIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const { products, loading, error, refetch } = useProducts({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    price: 0,
    category: 'Face',
    image: '',
    description: '',
    sku: '',
    rating: 5,
    reviewsCount: 0,
    tags: ['Clean']
  });

  if (authLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error: insertError } = await supabase.from('products').insert({
        name: newProduct.name,
        brand: newProduct.brand,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        description: newProduct.description,
        sku: newProduct.sku,
        rating: newProduct.rating,
        reviewsCount: newProduct.reviewsCount,
        tags: newProduct.tags,
      });

      if (insertError) throw insertError;

      await refetch();
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        brand: '',
        price: 0,
        category: 'Face',
        image: '',
        description: '',
        sku: '',
        rating: 5,
        reviewsCount: 0,
        tags: ['Clean']
      });
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      await refetch();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-screen" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-brand mb-2">Admin Dashboard</h1>
            <p className="text-stone-500">Manage your store's inventory and orders.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-brand text-white px-6 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-[5px] border border-stone-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-lg font-serif">Inventory Management</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-8 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-[5px] text-[10px] outline-none focus:border-brand transition-all w-48"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-[5px] object-cover border border-stone-100" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-medium text-stone-900">{product.name}</p>
                              <p className="text-[10px] text-stone-400 font-mono uppercase">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                            title="Remove Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[5px] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-2xl font-serif text-brand">Add New Product</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Product Name</label>
                      <input 
                        required
                        type="text" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all"
                        placeholder="e.g. Velvet Night Cream"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Brand</label>
                      <input 
                        required
                        type="text" 
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all"
                        placeholder="e.g. Beautistic Glam"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Price ($)</label>
                        <input 
                          required
                          type="number" 
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Category</label>
                        <select 
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all"
                        >
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Image URL</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          required
                          type="url" 
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">SKU</label>
                      <input 
                        required
                        type="text" 
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all"
                        placeholder="BL-NC-001"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Description</label>
                      <textarea 
                        required
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand transition-all resize-none"
                        placeholder="Describe the product benefits..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-2.5 rounded-[5px] text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="bg-brand text-white px-8 py-2.5 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20 disabled:opacity-70"
                  >
                    {saving ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;