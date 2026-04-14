import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useApp } from '../store/AppContext';
import ProductCard from '../components/Product/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorState } from '../components/EmptyState';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error, refetch } = useProduct(id || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howTo'>('description');
  const { addToCart, toggleWishlist, wishlist } = useApp();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return []; 
  }, [product]);

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

  const secondaryImages = [
    product.image,
    `https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=600&auto=format&fit=crop`,
    `https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop`
  ];

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
          <div className="grid grid-cols-4 gap-4 mt-4">
            {secondaryImages.map((img, idx) => (
              <div key={idx} className="aspect-square bg-stone-100 overflow-hidden cursor-pointer hover:border-brand border-2 border-transparent transition-all rounded-[5px]">
                <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-[10px] text-brand uppercase tracking-[0.3em] font-bold">{product.brand}</p>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em]">SKU: {product.sku}</p>
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
            <p className="text-4xl font-serif text-brand font-bold">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-stone-600 leading-relaxed text-lg">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-stone-50 border border-stone-100 text-brand text-[10px] uppercase tracking-widest rounded-[5px] font-bold">{tag}</span>
            ))}
          </div>

          <div className="space-y-6 pt-10 border-t border-stone-100">
            <div className="flex items-center gap-6">
              <div className="flex border border-stone-200 rounded-[5px] overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-14 h-14 flex items-center justify-center hover:bg-brand hover:text-white transition-colors border-r border-stone-200">-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly
                  className="w-14 h-14 text-center border-none focus:ring-0 bg-transparent text-lg" 
                />
                <button onClick={() => setQuantity(q => q+1)} className="w-14 h-14 flex items-center justify-center hover:bg-brand hover:text-white transition-colors border-l border-stone-200">+</button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-brand text-white h-14 uppercase tracking-widest text-sm bg-brand-hover transition-colors rounded-[5px] font-bold"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border border-stone-200 flex items-center justify-center transition-colors rounded-[5px] ${isWishlisted ? 'bg-brand/10 border-brand/20' : 'hover:bg-stone-50'}`}
              >
                <svg className={`w-6 h-6 ${isWishlisted ? 'fill-brand stroke-brand' : 'stroke-stone-600'}`} fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="pt-16">
            <div className="flex border-b border-stone-100 mb-8 overflow-x-auto relative">
              <button 
                onClick={() => setActiveTab('description')}
                className={`relative pb-4 px-8 text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'description' ? 'text-brand font-bold' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Description
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-brand animate-fadeIn" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('ingredients')}
                className={`relative pb-4 px-8 text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'ingredients' ? 'text-brand font-bold' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Ingredients
                {activeTab === 'ingredients' && (
                  <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-brand animate-fadeIn" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('howTo')}
                className={`relative pb-4 px-8 text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'howTo' ? 'text-brand font-bold' : 'text-stone-400 hover:text-stone-600'}`}
              >
                How to Use
                {activeTab === 'howTo' && (
                  <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-brand animate-fadeIn" />
                )}
              </button>
            </div>
            
            <div className="min-h-[150px] animate-fadeIn bg-stone-50/50 p-8 rounded-[5px] border border-stone-100">
              {activeTab === 'description' && (
                <div className="prose prose-stone prose-lg max-w-none">
                  <p>{product.description}</p>
                  <p className="mt-4">Our commitment to clean beauty means this product is formulated without parabens, sulfates, or synthetic fragrances. Each bottle is carefully crafted to deliver visible results while maintaining skin health.</p>
                </div>
              )}
              {activeTab === 'ingredients' && (
                <ul className="grid grid-cols-2 gap-6">
                  {product.ingredients.map(ing => (
                    <li key={ing} className="flex items-center gap-3 text-base text-stone-600">
                      <span className="w-1.5 h-1.5 bg-brand rounded-full" /> {ing}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'howTo' && (
                <div className="text-stone-600 text-base leading-relaxed">
                  <p className="font-bold mb-4 text-brand text-lg">Step-by-Step Instructions:</p>
                  <p>{product.howToUse}</p>
                  <p className="mt-6 italic text-sm">Tip: For best results, use consistently as part of your daily routine. Patch test before use.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-32 pt-24 border-t border-stone-100">
          <h2 className="text-4xl font-serif text-stone-900 mb-12">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;