import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

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
          </main>
          <Footer />
        </div>
      </AppProvider>
    </Router>
  );
};

export default App;