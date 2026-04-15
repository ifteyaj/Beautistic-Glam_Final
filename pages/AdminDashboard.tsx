import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Trash2, X, Image as ImageIcon, Package, ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { productService, ProductInput } from '../lib/products';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Product } from '../types';
import { CATEGORIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductInput>({
    name: '',
    brand: '',
    price: 0,
    category: 'Face',
    image: '',
    description: '',
    sku: '',
    rating: 5,
    reviewsCount: 0,
    tags: ['Clean'],
    isActive: true,
  });

  const isAdmin = isAuthenticated && (
    user?.role === 'admin' || 
    user?.email === 'admin@Glam.com' ||
    user?.email === 'admin@bliss.com'
  );

  // Fetch all products for admin
  const fetchProducts = async () => {
    setProductsLoading(true);
    const result = await productService.getAllProducts();
    if (result.success) {
      setProducts(result.products);
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === 'orders' && isAdmin) {
      fetchOrders();
    }
  }, [activeTab, isAdmin]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await (window as any).supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setOrdersLoading(false);
  };

  if (authLoading) return <LoadingSpinner size="lg" className="min-h-screen" />;
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Access Denied</h2>
          <p className="text-stone-500">You need admin access to view this page.</p>
        </div>
      </div>
    );
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await productService.createProduct(newProduct);

    if (result.success) {
      await fetchProducts();
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
        tags: ['Clean'],
        isActive: true,
      });
    } else {
      alert(result.error || 'Failed to create product');
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const result = await productService.deleteProduct(productId);
    if (result.success) {
      await fetchProducts();
    } else {
      alert(result.error || 'Failed to delete product');
    }
  };

  const handleToggleVisibility = async (productId: string, isActive: boolean) => {
    const result = await productService.toggleVisibility(productId, isActive);
    if (result.success) {
      await fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-brand">Admin Dashboard</h1>
            <p className="text-stone-500 text-sm mt-1">Manage your products and orders</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand text-white px-6 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-[5px] w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-[3px] text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-white text-brand shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Package className="w-4 h-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-[3px] text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-white text-brand shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="bg-white rounded-[5px] border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-lg font-serif">Product Management</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-8 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-[5px] text-[10px] outline-none focus:border-brand transition-all w-48"
                />
              </div>
            </div>

            {productsLoading ? (
              <div className="p-12 text-center"><LoadingSpinner /></div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-stone-400">No products yet. Add your first product!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-[5px] object-cover border border-stone-100" />
                            <div>
                              <p className="font-medium text-stone-900">{product.name}</p>
                              <p className="text-[10px] text-stone-400 font-mono uppercase">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">${(product.price || 0).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            product.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive !== false ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex gap-2 justify-end">
                          <button 
                            onClick={() => handleToggleVisibility(product.id, product.isActive === false)}
                            className="p-2 text-stone-400 hover:text-brand transition-colors"
                            title={product.isActive === false ? 'Show Product' : 'Hide Product'}
                          >
                            {product.isActive === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-[5px] border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h3 className="text-lg font-serif">Order Management</h3>
              <p className="text-xs text-stone-400 mt-1">{orders.length} total orders</p>
            </div>
            
            {ordersLoading ? (
              <div className="p-12 text-center"><LoadingSpinner /></div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-stone-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{order.id?.slice(0, 8)}...</td>
                        <td className="px-6 py-4">{order.user_id?.slice(0, 8) || 'Guest'}</td>
                        <td className="px-6 py-4">{order.order_items?.length || 0} items</td>
                        <td className="px-6 py-4 font-medium">${(order.total_price || 0).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            'bg-stone-100 text-stone-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Product Modal */}
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
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Product Name *</label>
                        <input 
                          required
                          type="text" 
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          placeholder="e.g. Velvet Night Cream"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Brand *</label>
                        <input 
                          required
                          type="text" 
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          placeholder="e.g. Beautistic Glam"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Price ($) *</label>
                          <input 
                            required
                            type="number" 
                            step="0.01"
                            min="0"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Category *</label>
                          <select 
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Image URL *</label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input 
                            required
                            type="url" 
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">SKU</label>
                        <input 
                          type="text" 
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          placeholder="BL-NC-001"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">Description</label>
                        <textarea 
                          rows={3}
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand resize-none"
                          placeholder="Describe the product..."
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
                      className="bg-brand text-white px-8 py-2.5 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors disabled:opacity-70"
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
    </div>
  );
};

export default AdminDashboard;