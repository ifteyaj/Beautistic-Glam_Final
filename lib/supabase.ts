import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get env vars - Vite exposes these via import.meta.env
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://hybxyojngxzurpdukgyi.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_pBtQFBjoLn4cxnvRBSirWA__eAZfFTU';

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database table types
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
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
}