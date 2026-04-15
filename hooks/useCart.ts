import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Product } from '../types';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCartItems([]);
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
        console.log('Cart table not available:', cartError.message);
        setCartItems([]);
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
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please sign in to add items to cart' };
    }

    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: product.id, quantity });
        if (error) throw error;
      }

      await fetchCart();
      return { success: true };
    } catch (err: any) {
      console.error('Add to cart error:', err);
      return { success: false, error: 'Failed to add to cart' };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
      if (error) throw error;
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Failed to remove' };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(cartItemId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);
      if (error) throw error;
      await fetchCart();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Failed to update' };
    }
  };

  const clearCart = async () => {
    if (!user) return { success: false };
    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
      if (error) throw error;
      setCartItems([]);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to clear' };
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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