import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/Product/ProductCard';
import { Truck, Heart, Shield, Headphones } from 'lucide-react';

const Home: React.FC = () => {
  const { products, loading, error } = useProducts({ sortBy: 'default' });

  // Use flagged products if available, otherwise fall back to highest-rated / most recent
  const flaggedTopSellers = products.filter(p => p.isTopSeller);
  const topSellers = flaggedTopSellers.length > 0
    ? flaggedTopSellers
    : [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const flaggedNewArrivals = products.filter(p => p.isNew);
  const newArrivals = flaggedNewArrivals.length > 0
    ? flaggedNewArrivals
    : [...products].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-brand rounded-full animate-spin" />
        <p className="text-stone-500 text-sm uppercase tracking-widest">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">⚠️ {error}</p>
          <p className="text-stone-500 text-sm">Please check your connection and try again.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-brand text-white px-6 py-3 rounded-[5px] text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden -mt-16 sm:-mt-20">
        <img 
          src="/hero-image.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Beauty"
        />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl">
            <h2 className="text-sm uppercase tracking-[0.2em] mb-4 text-white/80">The Summer Collection</h2>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight text-white">Elevate Your Inner Glow</h1>
            <Link 
              to="/shop" 
              className="inline-block bg-white text-stone-900 px-10 py-4 uppercase tracking-widest text-xs hover:bg-stone-100 transition-all duration-300 rounded-[5px] font-bold"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative h-96 group overflow-hidden rounded-[5px]">
            <img src="/images/categories/face care.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Face" />
            <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-brand/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-serif mb-4">Face Care</h3>
              <Link to="/shop?category=Face" className="text-xs uppercase tracking-widest border-b-2 border-white pb-1 hover:text-brand transition-colors">Shop Now</Link>
            </div>
          </div>
          <div className="relative h-96 group overflow-hidden rounded-[5px]">
            <img src="/images/categories/color palette.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Lips" />
             <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-brand/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-serif mb-4">Color Palette</h3>
              <Link to="/shop?category=Lips" className="text-xs uppercase tracking-widest border-b-2 border-white pb-1 hover:text-brand transition-colors">Shop Now</Link>
            </div>
          </div>
          <div className="relative h-96 group overflow-hidden rounded-[5px]">
            <img src="/images/categories/Body Essentials.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Body" />
             <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-brand/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-serif mb-4">Body Essentials</h3>
              <Link to="/shop?category=Body" className="text-xs uppercase tracking-widest border-b-2 border-white pb-1 hover:text-brand transition-colors">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand mb-2">Curated for you</h2>
            <h3 className="text-4xl font-serif text-stone-900">Top Sellers</h3>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-widest border-b-2 border-brand pb-1 font-bold text-brand hover:text-brand-hover transition-colors">View All</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {topSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="bg-[#F2EDEA] py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-white/80 p-12 rounded-[5px] backdrop-blur-sm border border-stone-100">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-brand font-bold">Exclusive Offer</h2>
            <h3 className="text-5xl font-serif mb-8 text-stone-800 leading-tight">Buy One, Get the Second for 30% Off</h3>
            <p className="text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">Discover our award-winning serums and elixirs. Mix and match your favorites for a limited time only.</p>
            <Link to="/shop" className="bg-brand text-white px-10 py-4 uppercase tracking-widest text-xs hover:bg-brand-hover transition-colors inline-block rounded-[5px] font-bold">Claim Discount</Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand mb-2 font-bold">Just Landed</h2>
            <h3 className="text-4xl font-serif text-stone-900">New Arrivals</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter with full width background image */}
      <section className="relative py-24">
        <img 
          src="/images/categories/face care.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Newsletter background"
        />
        <div className="absolute inset-0 bg-stone-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto py-16 px-8">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-white font-bold">Stay Inspired</h2>
            <h3 className="text-4xl font-serif mb-8 text-white">Join our newsletter</h3>
            <p className="text-stone-200 mb-12 max-w-lg mx-auto">Get beauty tips, exclusive offers and early access to new product launches delivered to your inbox.</p>
            <form className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/90 border-2 border-transparent rounded-[5px] py-3 px-6 outline-none text-stone-900 placeholder-stone-500 focus:border-brand transition-all"
              />
              <button className="bg-brand text-white px-8 py-3 text-xs uppercase tracking-widest rounded-[5px] hover:bg-brand-hover transition-colors font-bold">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges with Icons */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center bg-stone-50 p-6 rounded-[5px]">
            <Truck className="w-8 h-8 mx-auto mb-4 text-brand" />
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-brand mb-2 font-bold">Shipping</h4>
            <p className="text-sm font-medium">Free Worldwide Delivery</p>
          </div>
          <div className="text-center bg-stone-50 p-6 rounded-[5px]">
            <Heart className="w-8 h-8 mx-auto mb-4 text-brand" />
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-brand mb-2 font-bold">Ethics</h4>
            <p className="text-sm font-medium">100% Cruelty-Free</p>
          </div>
          <div className="text-center bg-stone-50 p-6 rounded-[5px]">
            <Shield className="w-8 h-8 mx-auto mb-4 text-brand" />
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-brand mb-2 font-bold">Security</h4>
            <p className="text-sm font-medium">Secure Payments</p>
          </div>
          <div className="text-center bg-stone-50 p-6 rounded-[5px]">
            <Headphones className="w-8 h-8 mx-auto mb-4 text-brand" />
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-brand mb-2 font-bold">Service</h4>
            <p className="text-sm font-medium">24/7 Premium Support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
