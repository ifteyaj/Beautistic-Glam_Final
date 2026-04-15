import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(product);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to use wishlist');
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <div className="group relative">
      <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative rounded-[5px]">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg 
            className={`w-5 h-5 ${isWishlisted ? 'fill-brand stroke-brand' : 'stroke-stone-600'}`} 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-brand text-white text-xs uppercase tracking-widest py-3 hover:bg-brand-hover transition-colors rounded-[5px]"
          >
            Add to Cart
          </button>
        </div>

        {product.isNew && (
          <span className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-[5px]">New</span>
        )}
        {product.isTopSeller && (
          <span className="absolute top-4 left-4 bg-brand text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-[5px]">Best Seller</span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium mb-1">{product.brand}</p>
        <div className="flex justify-between items-start gap-4">
          <Link to={`/product/${product.id}`} className="block flex-1">
            <h3 className="text-lg font-medium text-stone-900 group-hover:text-brand transition-colors leading-tight">{product.name}</h3>
          </Link>
          <p className="text-xl font-serif text-brand font-bold shrink-0">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;