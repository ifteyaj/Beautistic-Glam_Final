/**
 * ============================================
 * SUPABASE SERVICE LAYER
 * Complete backend service for beauty eCommerce
 * ============================================
 */

import { supabase, Product, Order, CartItem } from '../lib/supabase';
import type { User } from '../types';

/**
 * ============================================
 * AUTH SERVICE
 * ============================================
 */
export const authService = {
  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          // Disable email confirmation for easier testing
          // In production, you might want to enable this
          emailRedirectTo: typeof window !== 'undefined' 
            ? `${window.location.origin}/login`
            : undefined,
        },
      });

      if (error) throw error;

      // If user created, create profile in users table
      if (data.user) {
        try {
          await supabase.from('users').insert({
            id: data.user.id,
            email,
            name,
            role: 'user',
          });
        } catch (profileError) {
          // Log but don't fail - profile might already exist
          console.warn('Profile creation skipped:', profileError);
        }
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Sign up failed' 
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid credentials' 
      };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Reset password (send reset email)
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update password (when logged in)
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to auth changes
   */
  onAuthChange(callback: (event: string, session: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  },
};

/**
 * ============================================
 * PRODUCT SERVICE
 * ============================================
 */
export const productService = {
  /**
   * Get all products with optional filtering
   */
  async getProducts(options?: {
    category?: string;
    tags?: string[];
    searchQuery?: string;
    limit?: number;
  }) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      if (options?.tags && options.tags.length > 0) {
        query = query.contains('tags', options.tags);
      }

      if (options?.searchQuery) {
        query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, products: data as Product[] };
    } catch (error: any) {
      console.error('Get products error:', error);
      return { success: false, error: error.message, products: [] };
    }
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, product: data as Product };
    } catch (error: any) {
      console.error('Get product error:', error);
      return { success: false, error: error.message, product: null };
    }
  },

  /**
   * Get products by category
   */
  async getByCategory(category: string) {
    return this.getProducts({ category });
  },

  /**
   * Get featured products (best sellers / new)
   */
  async getFeatured(limit: number = 6) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('is_top_seller.eq.true,is_new.eq.true')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, products: data as Product[] };
    } catch (error: any) {
      console.error('Get featured error:', error);
      return { success: false, error: error.message, products: [] };
    }
  },
};

/**
 * ============================================
 * ORDER SERVICE
 * ============================================
 */
export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(orderData: {
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalPrice: number;
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingZip: string;
    shippingCountry: string;
  }) {
    try {
      // Start transaction
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          total_price: orderData.totalPrice,
          status: 'pending',
          shipping_name: orderData.shippingName,
          shipping_address: orderData.shippingAddress,
          shipping_city: orderData.shippingCity,
          shipping_zip: orderData.shippingZip,
          shipping_country: orderData.shippingCountry,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', orderData.userId);

      return { success: true, order };
    } catch (error: any) {
      console.error('Create order error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user's orders
   */
  async getOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, orders: data };
    } catch (error: any) {
      console.error('Get orders error:', error);
      return { success: false, error: error.message, orders: [] };
    }
  },

  /**
   * Get single order by ID
   */
  async getOrder(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { success: true, order: data };
    } catch (error: any) {
      console.error('Get order error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update order status (admin only)
   */
  async updateStatus(orderId: string, status: Order['status']) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, order: data };
    } catch (error: any) {
      console.error('Update order status error:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * ============================================
 * CART SERVICE
 * ============================================
 */
export const cartService = {
  /**
   * Get user's cart with product details
   */
  async getCart(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, cart: data };
    } catch (error: any) {
      console.error('Get cart error:', error);
      return { success: false, error: error.message, cart: [] };
    }
  },

  /**
   * Add item to cart
   */
  async addToCart(userId: string, productId: string, quantity: number = 1) {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existing) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return { success: true, cartItem: data };
      }

      // Insert new
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, cartItem: data };
    } catch (error: any) {
      console.error('Add to cart error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartItemId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        return this.removeFromCart(cartItemId);
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, cartItem: data };
    } catch (error: any) {
      console.error('Update quantity error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart(userId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Clear cart error:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * ============================================
 * WISHLIST SERVICE
 * ============================================
 */
export const wishlistService = {
  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, wishlist: data };
    } catch (error: any) {
      console.error('Get wishlist error:', error);
      return { success: false, error: error.message, wishlist: [] };
    }
  },

  /**
   * Add to wishlist
   */
  async addToWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .insert({ user_id: userId, product_id: productId })
        .select()
        .single();

      if (error) throw error;
      return { success: true, item: data };
    } catch (error: any) {
      console.error('Add to wishlist error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return { success: true, isInWishlist: !!data };
    } catch (error: any) {
      return { success: true, isInWishlist: false };
    }
  },
};