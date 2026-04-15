import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useWishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) {
        console.log('Wishlist table note:', error.message);
        setWishlist([]);
      } else {
        setWishlist(data?.map(item => item.product_id) || []);
      }
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please sign in' };
    }

    try {
      const isInList = wishlist.includes(productId);

      if (isInList) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
        setWishlist(prev => [...prev, productId]);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Failed to update wishlist' };
    }
  };

  return {
    wishlist,
    loading,
    toggleWishlist,
    refetch: fetchWishlist,
  };
};