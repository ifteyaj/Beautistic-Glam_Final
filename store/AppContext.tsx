import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import type { Product, CartItem, User, AuthState } from '../types';

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  auth: AuthState;
  products: Product[];
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (productId: string) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  toggleWishlist: (productId: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  login: (user: User) => void;
  logout: () => Promise<void>;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading, signIn, signOut } = useAuth();
  const { cartItems, addToCart: addToCartHook, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { wishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

  const auth: AuthState = {
    user,
    isAuthenticated,
    isLoading: authLoading,
  };

  const login = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const logout = async () => {
    await signOut();
  };

  const cart = cartItems.map(item => ({
    ...item.product,
    quantity: item.quantity,
  })) as CartItem[];

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      auth,
      products: [],
      addToCart: async (product, quantity = 1) => addToCartHook(product, quantity),
      removeFromCart: async (productId) => {
        const item = cartItems.find(i => i.product?.id === productId);
        if (item) return removeFromCart(item.id);
        return { success: false, error: 'Item not found' };
      },
      updateQuantity: async (productId, quantity) => {
        const item = cartItems.find(i => i.product?.id === productId);
        if (item) return updateQuantity(item.id, quantity);
        return { success: false, error: 'Item not found' };
      },
      toggleWishlist: async (productId) => toggleWishlistHook(productId),
      clearCart: async () => clearCart(),
      login: login as any,
      logout,
      addProduct: () => {},
      removeProduct: () => {},
      cartTotal,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};