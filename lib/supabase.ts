import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get env vars - Vite exposes these via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hybxyojngxzurpdukgyi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Ynh5b2puZ3h6dXJwZHVrZ3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODM4NjYsImV4cCI6MjA5MTc1OTg2Nn0.IbOPC_6Cv4HLQmprULq8bFILeGZbJfpWXah843swddo';

// Validate environment variables
console.log('>>> Supabase Key being used:', supabaseKey?.substring(0, 50) + '...');

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