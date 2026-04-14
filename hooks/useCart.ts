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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('*')
        .eq('userId', user.id);

      if (cartError) throw cartError;

      if (cartData && cartData.length > 0) {
        const productIds = cartData.map(item => item.productId);
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) throw productsError;

        const itemsWithProducts = cartData.map(cartItem => {
          const product = productsData?.find(p => p.id === cartItem.productId);
          return {
            ...cartItem,
            product: product as Product,
          };
        }).filter(item => item.product);

        setCartItems(itemsWithProducts);
      } else {
        setCartItems([]);
      }
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please sign in to add items to cart' };
    }

    try {
      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('userId', user.id)
        .eq('productId', product.id)
        .single();

      if (existingItem) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart')
          .insert({
            userId: user.id,
            productId: product.id,
            quantity,
          });

        if (insertError) throw insertError;
      }

      await fetchCart();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      return { success: false, error: err.message || 'Failed to add to cart' };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartItemId);

      if (deleteError) throw deleteError;

      await fetchCart();
      return { success: true };
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      return { success: false, error: err.message || 'Failed to remove from cart' };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartItemId);

      if (updateError) throw updateError;

      await fetchCart();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      return { success: false, error: err.message || 'Failed to update quantity' };
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('userId', user.id);

      if (deleteError) throw deleteError;

      setCartItems([]);
      return { success: true };
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      return { success: false, error: err.message || 'Failed to clear cart' };
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