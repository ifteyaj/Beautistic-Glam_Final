import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useApp } from '../store/AppContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id || '');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useApp();

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link to="/shop" className="text-xs uppercase tracking-widest border-b border-brand pb-1 text-brand">Back to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <div className="flex-1 lg:max-w-xl">
          <div className="aspect-[3/4] bg-stone-100 overflow-hidden group relative rounded-[5px] border border-stone-100">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand/0 hover:bg-brand/5 transition-colors cursor-zoom-in" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-[10px] text-brand uppercase tracking-[0.3em] font-bold">{product.brand}</p>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif text-stone-900 mb-6 leading-[1.1]">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-brand' : 'fill-stone-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-sm text-stone-400">({product.reviewsCount} Reviews)</span>
            </div>
            <p className="text-6xl font-serif text-brand font-bold">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-stone-600 leading-relaxed text-lg">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-stone-50 border border-stone-100 text-brand text-[10px] uppercase tracking-widest rounded-[5px] font-bold">{tag}</span>
            ))}
          </div>

          <div className="space-y-6 pt-10 border-t border-stone-100">
            <div className="flex items-center gap-4">
              <div className="flex border border-stone-200 rounded-[5px] overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-12 h-12 flex items-center justify-center hover:bg-brand hover:text-white transition-colors border-r border-stone-200 text-lg">-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly
                  className="w-12 h-12 text-center border-none focus:ring-0 bg-transparent text-base" 
                />
                <button onClick={() => setQuantity(q => q+1)} className="w-12 h-12 flex items-center justify-center hover:bg-brand hover:text-white transition-colors border-l border-stone-200 text-lg">+</button>
              </div>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 border border-stone-200 flex items-center justify-center transition-colors rounded-[5px] ${isWishlisted ? 'bg-brand/10 border-brand/20' : 'hover:bg-stone-50'}`}
              >
                <svg className={`w-5 h-5 ${isWishlisted ? 'fill-brand stroke-brand' : 'stroke-stone-600'}`} fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            
            <button 
              onClick={() => addToCart(product, quantity)}
              className="w-full bg-gradient-to-r from-[#C24458] to-[#A83850] text-white h-16 uppercase tracking-widest text-sm hover:from-[#A83850] hover:to-[#8B2F45] transition-all rounded-[5px] font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>

          {/* Description */}
          <div className="pt-12">
            <h3 className="text-lg font-serif text-stone-900 mb-3">Description</h3>
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;