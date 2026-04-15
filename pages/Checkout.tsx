import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../lib/orders';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface FormData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!formData.customerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter your delivery address');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return;
    }
    if (!formData.zipCode.trim()) {
      setError('Please enter your ZIP code');
      return;
    }

    setLoading(true);
    setError(null);

    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const result = await orderService.createOrder({
      userId: user.id,
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      notes: formData.notes,
      items: orderItems,
      totalAmount: cartTotal,
    });

    if (result.success && result.orderId) {
      await clearCart();
      navigate(`/order-confirmation/${result.orderId}`);
    } else {
      setError(result.error || 'Failed to place order. Please try again.');
    }
    
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif text-stone-900 mb-4">Sign in to Checkout</h2>
        <p className="text-stone-500 mb-8">Please sign in to complete your order.</p>
        <Link to="/login" className="bg-brand text-white px-10 py-3 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px]">Sign In</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif text-stone-900 mb-4">Your Cart is Empty</h2>
        <p className="text-stone-500 mb-8">Add some products to your cart first.</p>
        <Link to="/shop" className="bg-brand text-white px-10 py-3 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px]">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 lg:py-12">
      <h1 className="text-2xl font-serif text-stone-900 mb-6 text-center">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Delivery Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-stone-50 p-5 rounded-[5px] border border-stone-100">
              <h3 className="text-lg font-serif text-stone-900 mb-4">Delivery Information</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-[5px] mb-4 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="customerName" className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1 font-bold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-[5px] focus:ring-brand focus:border-brand text-stone-900 text-sm"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1 font-bold">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-[5px] focus:ring-brand focus:border-brand text-stone-900 text-sm"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1 font-bold">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-[5px] focus:ring-brand focus:border-brand text-stone-900 text-sm"
                    placeholder="Delivery address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1 font-bold">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-stone-200 rounded-[5px] focus:ring-brand focus:border-brand text-stone-900 text-sm"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1 font-bold">
                      ZIP *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-stone-200 rounded-[5px] focus:ring-brand focus:border-brand text-stone-900 text-sm"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1 font-bold">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-stone-200 rounded-[5px] focus:ring-brand focus:border-brand text-stone-900 text-sm resize-none"
                    placeholder="Special instructions"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-2.5 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors rounded-[5px] font-bold disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Place Order (COD)'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-64">
          <div className="bg-stone-50 p-5 rounded-[5px] border border-stone-100 sticky top-16 h-fit">
            <h3 className="text-lg font-serif text-stone-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 aspect-[3/4] bg-stone-100 overflow-hidden rounded-[5px] flex-shrink-0">
                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-900 font-medium truncate">{item.product?.name}</p>
                    <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                    <p className="text-xs font-serif text-brand">${(item.product?.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal</span>
                <span className="text-stone-900 font-serif">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span>Shipping</span>
                <span className="text-brand text-[10px] font-bold">Free</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-sm font-serif">Total</span>
                <span className="text-lg font-serif font-bold text-brand">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">Pay when you receive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;