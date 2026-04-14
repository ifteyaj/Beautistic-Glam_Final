import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useWishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
        .select('productId')
        .eq('userId', user.id);

      if (error) throw error;

      setWishlist(data?.map(item => item.productId) || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Please sign in to use wishlist' };
    }

    try {
      const isInWishlist = wishlist.includes(productId);

      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('userId', user.id)
          .eq('productId', productId);

        if (error) throw error;

        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({
            userId: user.id,
            productId,
          });

        if (error) throw error;

        setWishlist(prev => [...prev, productId]);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error toggling wishlist:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    wishlist,
    loading,
    toggleWishlist,
    refetch: fetchWishlist,
  };
};