import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get env vars - Vite exposes these via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hybxyojngxzurpdukgyi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Ynh5b2puZ3h6dXJwZHVrZ3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODM4NjYsImV4cCI6MjA5MTc1OTg2Nn0.IbOPC_6Cv4HLQmprULq8bFILeGZbJfpWXah843swddo';

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ============================================
// Database Types
// ============================================

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  tags: string[];
  image: string;
  description: string;
  ingredients: string[];
  howToUse: string;
  rating: number;
  reviewsCount: number;
  sku: string;
  isNew?: boolean;
  isTopSeller?: boolean;
  stock?: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingCountry?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  product?: Product;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

// ============================================
// Database Helper Functions
// ============================================

export const db = {
  // Products
  async getProducts(options?: {
    category?: string;
    tags?: string[];
    searchQuery?: string;
  }) {
    let query = supabase.from('products').select('*');
    
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    if (options?.searchQuery) {
      query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  },

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Product;
  },

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },

  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Cart
  async getCart(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    // Check if item exists
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
      return data;
    }

    // Insert new
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
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
    return data;
  },

  async removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    if (error) throw error;
  },

  async clearCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  },
};