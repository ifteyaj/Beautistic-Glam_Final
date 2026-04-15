import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../constants';
import { SortOption } from '../types';
import ProductCard from '../components/Product/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState, EmptyState } from '../components/EmptyState';

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
      <div className="max-w-7xl mx-auto px-4 py-24">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-stone-900 mb-4">Shop Collection</h1>
        <div className="flex items-center text-xs text-stone-400 uppercase tracking-widest">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-brand font-bold">Shop</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-12">
          <div className="bg-white p-6 rounded-[5px] border border-stone-100">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand mb-6 border-b border-stone-50 pb-2">Categories</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setSearchParams({})}
                  className={`text-sm w-full text-left px-3 py-2 rounded-[5px] transition-colors ${!category ? 'bg-brand text-white' : 'text-stone-500 hover:bg-stone-50 hover:text-brand'}`}
                >
                  All Products
                </button>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setSearchParams({ category: cat })}
                    className={`text-sm w-full text-left px-3 py-2 rounded-[5px] transition-colors ${category === cat ? 'bg-brand text-white' : 'text-stone-500 hover:bg-stone-50 hover:text-brand'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

<div className="bg-white p-6 rounded-[5px] border border-stone-100">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand mb-6 border-b border-stone-50 pb-2">Price Range</h4>
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
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-[5px] border border-stone-100">
            <p className="text-sm text-stone-500">
              Showing <span className="text-brand font-medium">1–{filteredProducts.length}</span> of {filteredProducts.length} Results
            </p>
            <div className="flex items-center gap-4">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'default' | 'price-low' | 'price-high' | 'rating' | 'newest')}
                className="bg-stone-50 text-sm font-medium border border-stone-100 py-2 px-4 outline-none focus:border-brand transition-colors rounded-[5px]"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="min-h-[50vh]" />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No products found for your criteria."
              onAction={() => { setPriceRange([0, 500]); setSortBy('default'); }}
              actionLabel="Clear all filters"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;