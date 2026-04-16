import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { orderService, OrderRecord } from '../lib/orders';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const icons: Record<string, React.ElementType> = {
    pending: Clock,
    confirmed: Package,
    shipped: Package,
    delivered: CheckCircle,
    cancelled: XCircle,
  };

  const Icon = icons[status] || Clock;
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      <Icon className="w-3.5 h-3.5" />
      {statusText}
    </span>
  );
};

const Orders: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await orderService.getUserOrders(user.id);
        
        if (result.success && result.orders) {
          setOrders(result.orders);
        } else {
          setError(result.error || 'Failed to load orders');
        }
      } catch (err) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (authLoading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-serif text-stone-900 mb-6">Please Sign In</h2>
        <p className="text-stone-500 mb-10">Sign in to view your orders.</p>
        <Link to="/login" className="bg-brand text-white px-12 py-4 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px]">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-brand text-white px-6 py-3 rounded-[5px] text-xs font-bold uppercase tracking-widest"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-serif text-stone-900 mb-12">My Orders</h1>
        <EmptyState
          title="No Orders Yet"
          message="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 lg:py-24">
      <h1 className="text-4xl font-serif text-stone-900 mb-12">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white border border-stone-200 rounded-[5px] p-6 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-sm font-mono text-stone-700">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Date</p>
                <p className="text-sm text-stone-600">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Address</p>
                <p className="text-sm text-stone-600 line-clamp-1 max-w-[200px]">{order.city}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Total</p>
                <p className="text-xl font-serif font-bold text-brand">${order.total_amount?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="hidden sm:block">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <Link 
              to={`/order-confirmation/${order.id}`}
              className="inline-flex items-center gap-1 px-4 py-2 bg-brand text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors rounded-[5px]"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
