import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { productService, ProductInput } from '../lib/products';

interface UseProductsOptions {
  category?: string;
  tags?: string[];
  sortBy?: 'default' | 'price-low' | 'price-high' | 'rating' | 'newest';
  searchQuery?: string;
}

// Hook for fetching customer products (only active ones)
export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchPromise = productService.getProducts(options);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timed out. Please check your internet.')), 5000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);

      if (!result.success) {
        setError(result.error || 'Failed to load products');
        setProducts([]);
      } else {
        setProducts(result.products);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products. Please check your connection.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options.category, JSON.stringify(options.tags), options.sortBy, options.searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

// Hook for fetching single product
export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchPromise = productService.getProduct(productId);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timed out. Please check your internet.')), 5000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);

      if (!result.success) {
        setError(result.error || 'Product not found');
        setProduct(null);
      } else {
        setProduct(result.product);
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};