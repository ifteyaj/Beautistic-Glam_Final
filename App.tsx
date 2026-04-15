import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import { LoadingPage } from './components/LoadingSpinner';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <Router>
      <AppProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/wishlist" element={<div className="py-24 text-center h-[70vh] flex flex-col items-center justify-center"><h2 className="text-2xl font-serif">Wishlist</h2><Link to="/shop" className="mt-4 border-b border-[#C24458] text-[#C24458] pb-1 uppercase tracking-widest text-xs font-bold">Back to Shop</Link></div>} />
                <Route path="/about" element={<div className="max-w-3xl mx-auto py-24 px-4 text-center"><h1 className="text-5xl font-serif mb-8 text-[#C24458]">Our Story</h1><p className="text-stone-600 leading-relaxed text-lg">Beautistic Glam.</p></div>} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </Router>
  );
};

export default App;
