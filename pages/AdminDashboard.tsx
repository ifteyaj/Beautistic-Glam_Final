import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Trash2, X, Package, ShoppingCart, Eye, EyeOff, ChevronDown, Menu, X as CloseIcon } from 'lucide-react';
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const result = await productService.createProduct(newProduct);
      if (result.success && result.product) {
        setProducts(prev => [result.product!, ...prev]);
        setSaveSuccess(true);
        setTimeout(() => {
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
          setSaveSuccess(false);
        }, 800);
      } else {
        setSaveError(result.error || 'Failed to create product');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const result = await productService.deleteProduct(productId);
      if (result.success) {
        await fetchProducts();
      }
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl lg:text-4xl font-serif text-brand">Admin</h1>
              <p className="text-stone-500 text-xs md:text-sm">Products & Orders</p>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-stone-600"
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand text-white px-4 md:px-6 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 w-full sm:w-auto order-last sm:order-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 mb-4 md:mb-6 bg-stone-100 p-1 rounded-[5px] w-full overflow-x-auto ${mobileMenuOpen ? 'hidden sm:flex' : 'flex'}`}>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 md:px-6 py-2 rounded-[3px] text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap ${activeTab === 'products' ? 'bg-white text-brand shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Package className="w-3 h-3 md:w-4 md:h-4" />
            <span className="md:hidden">{products.length}</span>
            <span className="hidden md:inline">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 md:px-6 py-2 rounded-[3px] text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-brand shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
            <span className="md:hidden">{orders.length}</span>
            <span className="hidden md:inline">Orders</span>
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-[5px] border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-3 md:p-6 border-b border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base md:text-lg font-serif">Products</h3>
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-[5px] text-xs outline-none focus:border-brand w-full"
                  />
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className="p-8 md:p-12 text-center"><LoadingSpinner /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 md:p-12 text-center text-stone-400 text-sm">
                {searchQuery ? 'No products found' : 'No products yet'}
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-stone-50">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-[5px] object-cover border border-stone-100" />
                              <div>
                                <p className="font-medium text-stone-900 text-sm">{product.name}</p>
                                <p className="text-[10px] text-stone-400 font-mono uppercase">{product.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-sm">${(product.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              product.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {product.isActive !== false ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1 justify-end">
                              <button 
                                onClick={() => handleToggleVisibility(product.id, product.isActive === false)}
                                className="p-1.5 md:p-2 text-stone-400 hover:text-brand transition-colors"
                                title={product.isActive === false ? 'Show' : 'Hide'}
                              >
                                {product.isActive === false ? <Eye className="w-3 h-3 md:w-4 md:h-4" /> : <EyeOff className="w-3 h-3 md:w-4 md:h-4" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1.5 md:p-2 text-stone-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-stone-50">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="p-3 flex items-start gap-3">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-[5px] object-cover border border-stone-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 text-sm truncate">{product.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono uppercase">{product.sku}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase">
                            {product.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            product.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive !== false ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <p className="font-medium text-brand text-sm mt-1">${(product.price || 0).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button 
                          onClick={() => handleToggleVisibility(product.id, product.isActive === false)}
                          className="p-1.5 text-stone-400 hover:text-brand transition-colors"
                        >
                          {product.isActive === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-[5px] border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-3 md:p-6 border-b border-stone-100">
              <h3 className="text-base md:text-lg font-serif">Orders</h3>
              <p className="text-xs text-stone-400 mt-1">{orders.length} total</p>
            </div>
            
            {ordersLoading ? (
              <div className="p-8 md:p-12 text-center"><LoadingSpinner /></div>
            ) : orders.length === 0 ? (
              <div className="p-8 md:p-12 text-center text-stone-400">
                <ShoppingCart className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-3 md:p-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div>
                        <p className="font-mono text-xs text-stone-400">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="font-medium text-stone-900 text-sm mt-0.5">{order.customer_name}</p>
                        <p className="text-xs text-stone-500">{order.phone}</p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="text-right">
                          <p className="font-medium text-brand text-sm">${(order.total_amount || 0).toFixed(2)}</p>
                          <p className="text-[10px] text-stone-400">{orderItems[order.id]?.length || 0} items</p>
                        </div>
                        <span className={`px-2 py-0.5 md:py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.status}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t border-stone-200">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Delivery Address</h4>
                            <p className="text-xs md:text-sm text-stone-900">{order.address}</p>
                            <p className="text-xs md:text-sm text-stone-600">{order.city}, {order.zip_code}</p>
                            {order.notes && <p className="text-xs text-stone-500 mt-1">Note: {order.notes}</p>}
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {orderItems[order.id]?.map((item) => (
                                <div key={item.id} className="flex items-center gap-2">
                                  <img src={item.product_image} alt={item.product_name} className="w-8 h-8 rounded-[5px] object-cover" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm text-stone-900 truncate">{item.product_name}</p>
                                    <p className="text-[10px] text-stone-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                  </div>
                                  <p className="text-xs md:text-sm font-medium text-brand">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="text-[10px] text-stone-400">
                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-[3px] hover:bg-blue-700"
                              >
                                Confirm
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'shipped')}
                                className="px-3 py-1.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-[3px] hover:bg-purple-700"
                              >
                                Ship
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-[3px] hover:bg-green-700"
                              >
                                Deliver
                              </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                className="px-3 py-1.5 border border-red-300 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-[3px] hover:bg-red-50"
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddModalOpen(false)}
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[5px] shadow-2xl overflow-hidden max-h-[90vh]"
              >
                <div className="p-4 md:p-6 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="text-lg md:text-2xl font-serif text-brand">Add Product</h2>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 hover:bg-stone-50 rounded-full">
                    <X className="w-5 h-5 text-stone-400" />
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto max-h-[75vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Name *</label>
                        <input 
                          required
                          type="text" 
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full px-3 py-2 md:py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          placeholder="Product name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Brand *</label>
                        <input 
                          required
                          type="text" 
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                          className="w-full px-3 py-2 md:py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          placeholder="Brand"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Price *</label>
                          <input 
                            required
                            type="number" 
                            step="0.01"
                            min="0"
                            value={newProduct.price || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewProduct({...newProduct, price: val === '' ? 0 : parseFloat(val) || 0});
                            }}
                            className="w-full px-3 py-2 md:py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Category *</label>
                          <select 
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full px-3 py-2 md:py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Image URL *</label>
                        <input
                          type="url"
                          required
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          className="w-full px-3 py-2 md:py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand"
                          placeholder="https://..."
                        />
                        {newProduct.image && (
                          <div className="mt-2 relative inline-block">
                            <img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-[5px] border" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/e2e8f0/94a3b4?text=?';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Description</label>
                        <textarea 
                          rows={2}
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="w-full px-3 py-2 md:py-2.5 bg-stone-50 border border-stone-200 rounded-[5px] text-sm outline-none focus:border-brand resize-none"
                          placeholder="Description..."
                        />
                      </div>
                    </div>
                  </div>

                  {saveError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-[5px] text-red-600 text-xs">
                      {saveError}
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-[5px] text-green-600 text-xs">
                      Product created!
                    </div>
                  )}

                  <div className="pt-3 md:pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      disabled={saving}
                      className="px-4 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 disabled:opacity-50 order-last sm:order-none"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="bg-brand text-white px-6 py-2 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {saving ? <LoadingSpinner size="sm" /> : null}
                      {saving ? 'Creating...' : 'Create'}
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