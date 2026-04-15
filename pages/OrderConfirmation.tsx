import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderService, OrderRecord, OrderItemRecord } from '../lib/orders';
import { LoadingSpinner } from '../components/LoadingSpinner';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [items, setItems] = useState<OrderItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      const result = await orderService.getOrderWithItems(orderId);
      if (result.success && result.order) {
        setOrder(result.order);
        setItems(result.items || []);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-serif text-stone-900 mb-6">Order Not Found</h2>
        <Link to="/shop" className="bg-brand text-white px-12 py-4 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px]">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-serif text-stone-900 mb-4">Order Confirmed!</h1>
        <p className="text-xl text-stone-600">Your order has been placed successfully!</p>
        <p className="text-lg text-brand font-medium mt-2">You will pay when the product is delivered</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-stone-50 rounded-[5px] border border-stone-100 overflow-hidden mb-8">
        <div className="bg-brand px-8 py-4">
          <h2 className="text-white text-sm uppercase tracking-widest font-bold">Order Details</h2>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-stone-200">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-1 font-bold">Order ID</p>
              <p className="text-lg font-serif text-stone-900">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-stone-500 mb-1 font-bold">Date</p>
              <p className="text-stone-900">{new Date(order.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>

          {/* Products */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4 font-bold">Products</p>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 aspect-[3/4] bg-stone-100 overflow-hidden rounded-[5px] flex-shrink-0">
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-stone-900 font-medium">{item.product_name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-sm font-serif text-brand font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6 pb-6 border-b border-stone-200">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4 font-bold">Delivery Address</p>
            <div className="text-stone-900">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-stone-600">{order.address}</p>
              <p className="text-stone-600">{order.city}, {order.zip_code}</p>
              <p className="text-stone-600 mt-2">📞 {order.phone}</p>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-serif">Total Amount</span>
            <span className="text-2xl font-serif font-bold text-brand">${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-blue-50 rounded-[5px] border border-blue-100 p-8 mb-8">
        <h3 className="text-lg font-serif text-stone-900 mb-6">What happens next?</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📞</span>
            </div>
            <div>
              <p className="font-medium text-stone-900">We'll call you to confirm</p>
              <p className="text-sm text-stone-600">Our team will contact you to verify your order</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚚</span>
            </div>
            <div>
              <p className="font-medium text-stone-900">Delivery in 2-5 days</p>
              <p className="text-sm text-stone-600">Your products will be delivered to your address</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💵</span>
            </div>
            <div>
              <p className="font-medium text-stone-900">Pay cash on delivery</p>
              <p className="text-sm text-stone-600">Payment will be collected when you receive your order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop" className="bg-brand text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px] text-center font-bold">
          Continue Shopping
        </Link>
        <Link to="/orders" className="border border-brand text-brand px-8 py-4 uppercase tracking-widest text-xs hover:bg-brand/5 transition-colors inline-block rounded-[5px] text-center font-bold">
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
