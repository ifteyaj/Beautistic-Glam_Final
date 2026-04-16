import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/Product/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating' | 'newest'>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  
  const query = searchParams.get('q');
  const category = searchParams.get('category') || undefined;

  const { products, loading, error, refetch } = useProducts({
    category,
    sortBy,
    searchQuery: query || undefined,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  }, [products, priceRange]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={refetch} className="text-brand underline">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero-like Header */}
      <section 
        className="py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-image.jpg)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white/80 py-20">
          <h1 className="text-5xl font-serif text-stone-900 mb-4">Shop Collection</h1>
          <p className="text-stone-600 max-w-xl mx-auto">Discover our curated selection of premium beauty products</p>
          <div className="flex items-center justify-center mt-4 text-xs text-stone-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand">Shop</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            {/* Categories */}
            <div className="bg-stone-50 p-6 rounded-[5px]">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-brand mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`text-sm w-full text-left px-3 py-2 rounded-[5px] transition-colors ${!category ? 'bg-brand text-white' : 'text-stone-600 hover:text-brand hover:bg-stone-100'}`}
                  >
                    All Products
                  </button>
                </li>
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSearchParams({ category: cat })}
                      className={`text-sm w-full text-left px-3 py-2 rounded-[5px] transition-colors ${category === cat ? 'bg-brand text-white' : 'text-stone-600 hover:text-brand hover:bg-stone-100'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="bg-stone-50 p-6 rounded-[5px]">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-brand mb-4">Price Range</h4>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-brand h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-stone-500">
                  <span>$0</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-100">
              <p className="text-sm text-stone-500">
                Showing <span className="text-brand font-medium">{filteredProducts.length}</span> products
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-sm font-medium border border-stone-200 py-2 px-4 outline-none focus:border-brand transition-colors rounded-[5px]"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {loading ? (
              <div className="min-h-[50vh] flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-stone-500 mb-6">No products found for your criteria.</p>
                <button 
                  onClick={() => { setPriceRange([0, 500]); setSortBy('default'); }}
                  className="text-brand hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;