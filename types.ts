
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Category = 'Body' | 'Antiage' | 'Oil' | 'Serum' | 'Personal Care' | 'Hand Creams' | 'Face' | 'Eyes' | 'Lips';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  tags: string[];
  image: string;
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  rating?: number;
  reviewsCount?: number;
  sku?: string;
  isNew?: boolean;
  isTopSeller?: boolean;
  isActive?: boolean;
  stock?: number;
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AppState {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  searchQuery: string;
}

export type SortOption = 'default' | 'price-low' | 'price-high' | 'newest' | 'rating';
