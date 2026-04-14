import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, ShieldCheck } from 'lucide-react';

// Simple mock auth context (without Supabase dependency)
interface AuthContextType {
  user: null;
  isAuthenticated: false;
  isLoading: false;
  signIn: () => {};
  signOut: () => {};
  signUp: () => {};
}

const MockAuthContext = React.createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
});

// Simple cart context
interface CartContextType {
  cartItems: [];
  cartCount: 0;
  cartTotal: 0;
  addToCart: () => {};
  removeFromCart: () => {};
}

const MockCartContext = React.createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
});

// Simple wishlist context
interface WishlistContextType {
  wishlist: [];
  toggleWishlist: () => {};
}

const MockWishlistContext = React.createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
});

// Provider wrappers
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MockAuthContext.Provider value={{ user: null, isAuthenticated: false, isLoading: false, signIn: () => {}, signOut: () => {}, signUp: () => {} }}>
    {children}
  </MockAuthContext.Provider>
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MockCartContext.Provider value={{ cartItems: [], cartCount: 0, cartTotal: 0, addToCart: () => {}, removeFromCart: () => {} }}>
    {children}
  </MockCartContext.Provider>
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MockWishlistContext.Provider value={{ wishlist: [], toggleWishlist: () => {} }}>
    {children}
  </MockWishlistContext.Provider>
);

// Custom hooks (simplified without Supabase)
export const useAuth = () => React.useContext(MockAuthContext);
export const useCart = () => React.useContext(MockCartContext);
export const useWishlist = () => React.useContext(MockWishlistContext);

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchVal)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="Beautistic Glam" 
                className="h-12 w-auto"
                style={{ maxHeight: '48px', width: 'auto' }}
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-10 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-stone-600 hover:text-[#C24458] uppercase tracking-widest text-[11px] font-semibold">Home</Link>
            <Link to="/shop" className="text-stone-600 hover:text-[#C24458] uppercase tracking-widest text-[11px] font-semibold">Shop</Link>
            <Link to="/about" className="text-stone-600 hover:text-[#C24458] uppercase tracking-widest text-[11px] font-semibold">About</Link>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-stone-600 hover:text-[#C24458] p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            
            <div className="relative" ref={accountMenuRef}>
              <Link to="/login" className="text-stone-600 hover:text-[#C24458] p-1">
                <User className="w-5 h-5" />
              </Link>
            </div>
            
            <Link to="/wishlist" className="text-stone-600 hover:text-[#C24458] relative p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>
            
            <Link to="/cart" className="text-stone-600 hover:text-[#C24458] relative p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div ref={searchRef} className="absolute top-20 left-0 w-full bg-white border-b border-stone-200 p-4">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center bg-stone-50 px-4">
            <input 
              type="text" 
              placeholder="Search our collection..." 
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full border-none focus:ring-0 text-lg py-4 bg-transparent"
            />
            <button type="submit" className="ml-4 p-2 text-stone-400 hover:text-[#C24458]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;