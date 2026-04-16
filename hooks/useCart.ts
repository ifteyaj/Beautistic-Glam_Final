import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Product } from '../types';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

const LOCAL_CART_KEY = 'beautistic_cart';

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage for guests
  const loadLocalCart = useCallback(() => {
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        // Load full product data for local items
        const localItems: CartItem[] = items.map((item: any, idx: number) => ({
          id: item.id || `local-${idx}`,
          product: item.product,
          quantity: item.quantity,
        }));
        setCartItems(localItems);
      }
    } catch (e) {
      console.error('Local cart error:', e);
    }
  }, []);

  const saveLocalCart = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Save local cart error:', e);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    // For guests, use local storage
    if (!isAuthenticated || !user) {
      loadLocalCart();
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Try database first
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cartError) {
        console.log('Cart DB note:', cartError.message);
        // Fall back to local cart for logged in users if DB fails
        loadLocalCart();
        setLoading(false);
        return;
      }

      if (cartData && cartData.length > 0) {
        const itemsWithProducts = await Promise.all(
          cartData.map(async (item: any) => {
            try {
              const { data: product } = await supabase
                .from('products')
                .select('*')
                .eq('id', item.product_id)
                .single();
              return {
                id: item.id,
                product: product as Product,
                quantity: item.quantity,
              };
            } catch {
              return null;
            }
          })
        );
        setCartItems(itemsWithProducts.filter((i): i is CartItem => i !== null && !!i.product));
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
      loadLocalCart();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, loadLocalCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Save to localStorage whenever cart changes (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(cartItems);
    }
  }, [cartItems, isAuthenticated, saveLocalCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    // For guests, use local storage
    if (!isAuthenticated || !user) {
      let newCartItems: CartItem[];
      const existing = cartItems.find(item => item.product.id === product.id);
      if (existing) {
        newCartItems = cartItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCartItems = [...cartItems, {
          id: `local-${Date.now()}`,
          product,
          quantity,
        }];
      }
      setCartItems(newCartItems);
      saveLocalCart(newCartItems);
      return { success: true };
    }

    // For logged in users - update UI immediately, then sync with DB
    const existingItem = cartItems.find(item => item.product?.id === product.id);
    let newCartItems: CartItem[];
    
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.product?.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCartItems = [...cartItems, { id: `db-${Date.now()}`, product, quantity }];
    }
    
    // Update UI immediately for instant feedback
    setCartItems(newCartItems);

    // Sync with database in background
    try {
      if (existingItem && !existingItem.id.startsWith('local-') && !existingItem.id.startsWith('db-')) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: product.id, quantity });
      }
      // Refresh to get correct IDs
      fetchCart();
    } catch (err) {
      console.error('Add to cart sync error:', err);
    }
    
    return { success: true };
  };

  const removeFromCart = async (cartItemId: string) => {
    // Update UI immediately
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    
    // Sync with database in background
    if (!cartItemId.startsWith('local-') && !cartItemId.startsWith('db-')) {
      try {
        await supabase.from('cart_items').delete().eq('id', cartItemId);
      } catch (err) {
        console.error('Remove from cart sync error:', err);
      }
    } else if (!isAuthenticated) {
      saveLocalCart(cartItems.filter(item => item.id !== cartItemId));
    }
    
    return { success: true };
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(cartItemId);

    // Update UI immediately
    setCartItems(prev => prev.map(item =>
      item.id === cartItemId ? { ...item, quantity } : item
    ));

    // Sync with database in background
    if (!cartItemId.startsWith('local-') && !cartItemId.startsWith('db-')) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId);
      } catch (err) {
        console.error('Update quantity sync error:', err);
      }
    }
    
    return { success: true };
  };

  const clearCart = async () => {
    // Clear local
    localStorage.removeItem(LOCAL_CART_KEY);
    setCartItems([]);

    // Clear DB if logged in
    if (user) {
      try {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      } catch (err) {
        // Ignore
      }
    }
    return { success: true };
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    refetch: fetchCart,
  };
};