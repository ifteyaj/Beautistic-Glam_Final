import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  const { cartCount } = useCart();
  
  // Check if user is admin
  const isAdmin = isAuthenticated && (
    user?.role === 'admin' || 
    user?.email === 'admin@Glam.com' ||
    user?.email === 'admin@bliss.com'
  );
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsAccountMenuOpen(false);
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
            
            {/* Account dropdown - shows based on auth state */}
            <div className="relative" ref={accountMenuRef}>
              {isLoading ? (
                <div className="w-5 h-5 animate-pulse bg-stone-200 rounded-full" />
              ) : isAuthenticated ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAccountMenuOpen(!isAccountMenuOpen);
                  }}
                  className="flex items-center text-stone-600 hover:text-[#C24458] p-1"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <Link to="/login" className="text-stone-600 hover:text-[#C24458] p-1">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Account dropdown menu */}
              {isAccountMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-[5px] shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-sm font-medium text-stone-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-stone-500">{user?.email || ''}</p>
                  </div>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            
            <Link to="/wishlist" className="text-stone-600 hover:text-[#C24458] relative p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>
            
            <Link to="/cart" className="text-stone-600 hover:text-[#C24458] relative p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-[#C24458] text-white text-xs font-bold flex items-center justify-center rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
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