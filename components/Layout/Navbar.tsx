import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Menu, X, Search, Heart, ShoppingBag, Home, Store, Info, LayoutDashboard, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();
  const { cartCount } = useCart();
  
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsAtTop(currentScrollY < 50);
      
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: Store },
    { to: '/about', label: 'About', icon: Info },
    ...(isAdmin ? [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, highlight: true }] : []),
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}>
        <div className={`mx-3 sm:mx-6 lg:mx-8 mt-3 transition-all duration-300 bg-white/95 backdrop-blur-md border border-stone-200 ${
          isAtTop 
            ? 'rounded-2xl' 
            : 'rounded-2xl'
        }`}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-20">
              {/* Mobile: Hamburger Menu */}
              <div className="flex items-center md:hidden">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className="p-2 text-stone-600 hover:text-[#C24458]"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {/* Left: Navigation Links (Desktop) */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  
                  return (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      className={`uppercase tracking-widest text-[10px] lg:text-[11px] font-semibold transition-all ${
                        link.highlight 
                          ? 'bg-gradient-to-r from-[#C24458] to-[#A83850] text-white px-3 py-1.5 rounded-[5px] shadow-md hover:shadow-lg hover:scale-105' 
                          : isActive 
                            ? 'text-[#C24458]' 
                            : 'text-stone-600 hover:text-[#C24458]'
                      }`}
                    >
                      {link.label}
                      {link.highlight && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] font-bold ml-1.5">ADMIN</span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Center: Logo */}
              <div className="flex-shrink-0 flex items-center absolute left-1/2 -translate-x-1/2">
                <Link to="/" className="flex items-center">
                  <img 
                    src="/logo.svg" 
                    alt="Beautistic Glam" 
                    className="h-8 sm:h-10 lg:h-12 w-auto"
                    style={{ maxHeight: '32px', width: 'auto' }}
                  />
                </Link>
              </div>

              {/* Right: Icons */}
              <div className="flex items-center space-x-3 sm:space-x-5 lg:space-x-6">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)} 
                  className="text-stone-600 hover:text-[#C24458] p-1"
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {/* Account dropdown */}
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

                  {isAccountMenuOpen && isAuthenticated && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-[5px] shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-sm font-medium text-stone-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-stone-500 truncate">{user?.email || ''}</p>
                      </div>
                      
                      <Link
                        to="/orders"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      
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
                  <Heart className="w-5 h-5" />
                </Link>
                
                <Link to="/cart" className="text-stone-600 hover:text-[#C24458] relative p-1">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#C24458] text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div ref={searchRef} className="absolute top-14 sm:top-20 left-0 w-full bg-white border-b border-stone-200 p-3 sm:p-4">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center bg-stone-50 px-3 sm:px-4 rounded-[5px]">
              <input 
                type="text" 
                placeholder="Search products..." 
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full border-none focus:ring-0 text-base sm:text-lg py-2 sm:py-4 bg-transparent"
              />
              <button type="submit" className="p-2 text-stone-400 hover:text-[#C24458]">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Slide-in */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <img src="/logo.svg" alt="Beautistic Glam" className="h-8" />
          <button onClick={() => setMobileMenuOpen(false)} className="p-1">
            <X className="w-5 h-5 text-stone-400" />
          </button>
        </div>
        
        <div className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-[5px] text-sm font-medium ${
                link.highlight
                  ? 'bg-gradient-to-r from-[#C24458] to-[#A83850] text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-[#C24458]'
              }`}
            >
              {link.label}
              {link.highlight && (
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Admin</span>
              )}
            </Link>
          ))}
          
          <hr className="my-4 border-stone-100" />
          
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-[#C24458] rounded-[5px] text-sm font-medium"
          >
            <Heart className="w-5 h-5" />
            Wishlist
          </Link>
          
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-[#C24458] rounded-[5px] text-sm font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Cart ({cartCount})
          </Link>
          
          <hr className="my-4 border-stone-100" />
          
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 text-xs text-stone-500">
                Signed in as<br/>
                <span className="text-stone-900 font-medium">{user?.name || 'User'}</span>
              </div>
              
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-[5px] text-sm font-medium"
              >
                <Package className="w-5 h-5" />
                My Orders
              </Link>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-[5px] text-sm font-medium w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-white bg-[#C24458] hover:bg-[#A83850] rounded-[5px] text-sm font-bold"
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
