import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState, ErrorState } from '../components/EmptyState';
import { Navigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cartItems, loading, error, removeFromCart, updateQuantity, cartTotal, refetch } = useCart();

  if (authLoading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-serif text-stone-900 mb-6">Sign in to view Cart</h2>
        <p className="text-stone-500 mb-10">Please sign in to see your cart items.</p>
        <Link to="/login" className="bg-brand text-white px-12 py-4 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px]">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <EmptyState 
          title="Your Cart is Empty" 
          message="Discover our collection and find your perfect beauty match."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <h1 className="text-4xl font-serif text-stone-900 mb-12">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-8">
          <div className="hidden lg:grid grid-cols-6 pb-6 border-b border-stone-100 text-[10px] uppercase tracking-widest text-brand font-bold">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>

          {cartItems.map(item => (
            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-6 items-center gap-6 py-8 border-b border-stone-100 group">
              <div className="col-span-1 lg:col-span-3 flex items-center gap-6">
                <div className="w-24 aspect-[3/4] bg-stone-100 overflow-hidden rounded-[5px] border border-stone-100">
                  <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] text-brand uppercase tracking-widest mb-1 font-bold">{item.product?.brand}</p>
                  <Link to={`/product/${item.product?.id}`} className="text-stone-900 hover:text-brand transition-colors font-medium">{item.product?.name}</Link>
                  <button onClick={() => removeFromCart(item.id)} className="block mt-2 text-[10px] text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors font-bold">Remove</button>
                </div>
              </div>

              <div className="text-center text-stone-900 font-serif">
                <span className="lg:hidden text-[10px] text-stone-400 uppercase mr-2">Price:</span>
                ${item.product?.price.toFixed(2)}
              </div>

              <div className="flex justify-center">
                <div className="flex border border-stone-200 w-fit rounded-[5px] overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand hover:text-white transition-all">-</button>
                  <input type="number" value={item.quantity} readOnly className="w-8 h-8 text-center border-none focus:ring-0 bg-transparent text-sm" />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-brand hover:text-white transition-all">+</button>
                </div>
              </div>

              <div className="text-right text-brand font-serif font-bold">
                <span className="lg:hidden text-[10px] text-stone-400 uppercase mr-2">Subtotal:</span>
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-8">
            <Link to="/shop" className="text-xs uppercase tracking-widest border border-brand text-brand px-6 py-3 rounded-[5px] flex items-center gap-2 font-bold hover:bg-brand/5 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-stone-50 p-8 space-y-8 rounded-[5px] border border-stone-100">
            <h3 className="text-xl font-serif text-stone-900">Order Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="text-stone-900 font-serif">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="text-brand uppercase tracking-widest text-[10px] font-bold">Calculated at next step</span>
              </div>
              <div className="pt-4 border-t border-stone-200 flex justify-between items-end">
                <span className="text-lg font-serif">Estimated Total</span>
                <span className="text-2xl font-serif font-bold text-brand">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block w-full bg-brand text-white text-center py-4 uppercase tracking-widest text-xs bg-brand-hover transition-colors rounded-[5px] font-bold">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;