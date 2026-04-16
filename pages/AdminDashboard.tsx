import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Trash2, X, Image as ImageIcon, Package, ShoppingCart, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { productService, ProductInput } from '../lib/products';
import { orderService, OrderRecord, OrderItemRecord } from '../lib/orders';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Product } from '../types';
import { CATEGORIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItemRecord[]>>({});
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
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

  const isAdmin = isAuthenticated && user?.role === 'admin';

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
    const result = await orderService.getAllOrders();
    if (result.success && result.orders) {
      setOrders(result.orders);
      const itemsMap: Record<string, OrderItemRecord[]> = {};
      for (const order of result.orders) {
        const itemsResult = await orderService.getOrderWithItems(order.id);
        if (itemsResult.success && itemsResult.items) {
          itemsMap[order.id] = itemsResult.items;
        }
      }
      setOrderItems(itemsMap);
    }
    setOrdersLoading(false);
  };

  if (authLoading) return <LoadingSpinner size="lg" className="min-h-screen" />;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await productService.createProduct(newProduct);

    if (result.success && result.product) {
      setProducts(prev => [result.product!, ...prev]);
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
    const result = await productService.deleteProduct(productId);
    if (result.success) {
      await fetchProducts();
    }
  };

  const handleToggleVisibility = async (productId: string, isActive: boolean) => {
    const result = await productService.toggleVisibility(productId, isActive);
    if (result.success) {
      await fetchProducts();
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderRecord['status']) => {
    const result = await orderService.updateOrderStatus(orderId, status);
    if (result.success) {
      await fetchOrders();
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
              <div className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-stone-50 transition-colors">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="text-left">
                          <p className="font-mono text-xs text-stone-400">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="font-medium text-stone-900 mt-1">{order.customer_name}</p>
                          <p className="text-xs text-stone-500">{order.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium text-brand">${(order.total_amount || 0).toFixed(2)}</p>
                          <p className="text-xs text-stone-400">{orderItems[order.id]?.length || 0} items</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.status}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-6 pt-6 border-t border-stone-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Delivery Address</h4>
                            <p className="text-sm text-stone-900">{order.address}</p>
                            <p className="text-sm text-stone-600">{order.city}, {order.zip_code}</p>
                            {order.notes && <p className="text-xs text-stone-500 mt-2">Note: {order.notes}</p>}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {orderItems[order.id]?.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-[5px] object-cover" />
                                  <div className="flex-1">
                                    <p className="text-sm text-stone-900">{item.product_name}</p>
                                    <p className="text-xs text-stone-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                  </div>
                                  <p className="text-sm font-medium text-brand">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-stone-200 flex items-center justify-between">
                          <div className="text-xs text-stone-400">
                            Ordered on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-[5px] hover:bg-blue-700 transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold uppercase tracking-widest rounded-[5px] hover:bg-purple-700 transition-colors"
                              >
                                Mark Shipped
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-widest rounded-[5px] hover:bg-green-700 transition-colors"
                              >
                                Mark Delivered
                              </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                className="px-4 py-2 border border-red-300 text-red-600 text-xs font-bold uppercase tracking-widest rounded-[5px] hover:bg-red-50 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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