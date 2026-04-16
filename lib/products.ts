/**
 * ============================================
 * PRODUCT SERVICE - Production Ready
 * All product operations go through here
 * ============================================
 */

import { supabase, Product } from '../lib/supabase';

export interface ProductInput {
  name: string;
  brand: string;
  price: number;
  category: string;
  tags?: string[];
  image: string;
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  rating?: number;
  reviewsCount?: number;
  sku?: string;
  isNew?: boolean;
  isTopSeller?: boolean;
  stock?: number;
  isActive?: boolean;
}

export const productService = {
  /**
   * Get all ACTIVE products (for customers)
   */
  async getProducts(options?: {
    category?: string;
    tags?: string[];
    searchQuery?: string;
    sortBy?: 'default' | 'price-low' | 'price-high' | 'rating' | 'newest';
  }) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
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

      const { data, error } = await query;

      if (error) throw error;

      let products = data || [];

      // Apply sorting
      if (options?.sortBy) {
        switch (options.sortBy) {
          case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'newest':
            products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
        }
      }

      return { success: true, products: products as Product[] };
    } catch (error: any) {
      console.error('Get products error:', error);
      return { success: false, error: error.message, products: [] };
    }
  },

  /**
   * Get single product by ID (for product detail page)
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
   * Get ALL products (for admin - includes inactive)
   */
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, products: data as Product[] };
    } catch (error: any) {
      console.error('Get all products error:', error);
      return { success: false, error: error.message, products: [] };
    }
  },

  /**
   * Create new product (admin only)
   */
  async createProduct(product: ProductInput) {
    try {
      if (!product.name?.trim()) {
        return { success: false, error: 'Product name is required' };
      }
      if (!product.brand?.trim()) {
        return { success: false, error: 'Brand is required' };
      }
      if (!product.price || product.price <= 0) {
        return { success: false, error: 'Valid price is required' };
      }
      if (!product.category?.trim()) {
        return { success: false, error: 'Category is required' };
      }
      if (!product.image?.trim()) {
        return { success: false, error: 'Image URL is required' };
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name.trim(),
          brand: product.brand.trim(),
          price: product.price,
          category: product.category,
          tags: product.tags || [],
          image: product.image,
          description: product.description || '',
          ingredients: product.ingredients || [],
          how_to_use: product.howToUse || '',
          rating: product.rating || 0,
          reviews_count: product.reviewsCount || 0,
          sku: product.sku || '',
          is_new: product.isNew || false,
          is_top_seller: product.isTopSeller || false,
          stock: product.stock || 100,
          is_active: product.isActive !== false,
        });

      if (error) throw error;
      
      return { success: true, product: {
        id: '',
        name: product.name.trim(),
        brand: product.brand.trim(),
        price: product.price,
        category: product.category,
        tags: product.tags || [],
        image: product.image,
        description: product.description || '',
        ingredients: product.ingredients || [],
        howToUse: product.howToUse || '',
        rating: product.rating || 0,
        reviewsCount: product.reviewsCount || 0,
        sku: product.sku || '',
        isActive: product.isActive !== false,
      } as Product };
    } catch (error: any) {
      console.error('Create product error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update product (admin only)
   */
  async updateProduct(id: string, updates: Partial<ProductInput>) {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name.trim();
      if (updates.brand !== undefined) updateData.brand = updates.brand.trim();
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients;
      if (updates.howToUse !== undefined) updateData.how_to_use = updates.howToUse;
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.reviewsCount !== undefined) updateData.reviews_count = updates.reviewsCount;
      if (updates.sku !== undefined) updateData.sku = updates.sku;
      if (updates.isNew !== undefined) updateData.is_new = updates.isNew;
      if (updates.isTopSeller !== undefined) updateData.is_top_seller = updates.isTopSeller;
      if (updates.stock !== undefined) updateData.stock = updates.stock;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, product: data as Product };
    } catch (error: any) {
      console.error('Update product error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete product (admin only)
   */
  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Delete product error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Toggle product visibility (admin only)
   */
  async toggleVisibility(id: string, isActive: boolean) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, product: data as Product };
    } catch (error: any) {
      console.error('Toggle visibility error:', error);
      return { success: false, error: error.message };
    }
  },
};