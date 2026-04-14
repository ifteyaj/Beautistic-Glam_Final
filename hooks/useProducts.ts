import { useState, useEffect, useCallback } from 'react';
import { supabase, Product } from '../lib/supabase';

// Fallback sample products (used when database is empty or unavailable)
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luminous Serum',
    brand: 'ENDYMIONS',
    price: 124.00,
    category: 'Serum',
    tags: ['Organic', 'Fresh', 'Clean'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
    description: 'A revolutionary serum that provides instant radiance and long-term skin rejuvenation.',
    ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Green Tea Extract'],
    howToUse: 'Apply 2-3 drops to clean face every morning and evening.',
    rating: 4.8,
    reviewsCount: 128,
    sku: 'BL-SR-001',
    isTopSeller: true
  },
  {
    id: '2',
    name: 'Face Elixir',
    brand: 'NATURAL',
    price: 30.00,
    category: 'Oil',
    tags: ['Natural', 'Clean'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800',
    description: 'A lightweight facial oil that deeply hydrates without clogging pores.',
    ingredients: ['Jojoba Oil', 'Argan Oil', 'Squalane'],
    howToUse: 'Warm 2 drops in palms and press gently into skin.',
    rating: 4.5,
    reviewsCount: 85,
    sku: 'BL-EL-002',
    isNew: true
  },
  {
    id: '3',
    name: 'Hydrating Cream',
    brand: 'BEAUTY',
    price: 30.00,
    category: 'Personal Care',
    tags: ['Fresh', 'Clean'],
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800',
    description: 'Intense 24-hour hydration for all skin types.',
    ingredients: ['Shea Butter', 'Ceramides', 'Glycerin'],
    howToUse: 'Apply to face and neck morning and night.',
    rating: 4.9,
    reviewsCount: 210,
    sku: 'BL-CR-003',
    isTopSeller: true
  },
  {
    id: '4',
    name: 'Velvet Matte Lipstick',
    brand: 'Beautistic Glam',
    price: 32.00,
    category: 'Lips',
    tags: ['Clean', 'Cruelty-Free'],
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
    description: 'High-pigment matte lipstick that feels like weightless silk.',
    ingredients: ['Castor Oil', 'Beeswax', 'Vitamin E'],
    howToUse: 'Apply directly to lips.',
    rating: 4.9,
    reviewsCount: 320,
    sku: 'BL-LP-008',
    isTopSeller: true
  },
  {
    id: '5',
    name: 'Rose Water Toner',
    brand: 'BEAUTY',
    price: 28.00,
    category: 'Face',
    tags: ['Organic', 'Natural'],
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbb43fe?w=800',
    description: 'Gentle hydrating toner with pure rose water.',
    ingredients: ['Rose Water', 'Glycerin', 'Aloe Vera'],
    howToUse: 'Apply with cotton pad after cleansing.',
    rating: 4.7,
    reviewsCount: 156,
    sku: 'BL-TN-005',
    isNew: true
  },
  {
    id: '6',
    name: 'Night Repair Mask',
    brand: 'ENDYMIONS',
    price: 65.00,
    category: 'Skincare',
    tags: ['Clean', 'Cruelty-Free'],
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    description: 'Overnight treatment for deep skin repair.',
    ingredients: ['Retinol', 'Peptides', 'Hyaluronic Acid'],
    howToUse: 'Apply thin layer before bed.',
    rating: 4.8,
    reviewsCount: 89,
    sku: 'BL-MK-006',
    isTopSeller: true
  }
];

// Fallback product map for single product lookup
const FALLBACK_PRODUCT_MAP: Record<string, Product> = FALLBACK_PRODUCTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<string, Product>);

export { FALLBACK_PRODUCT_MAP };

interface UseProductsOptions {
  category?: string;
  tags?: string[];
  sortBy?: 'default' | 'price-low' | 'price-high' | 'rating' | 'newest';
  searchQuery?: string;
}

// Hook for fetching list of products
export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { category, sortBy = 'default', searchQuery } = options;
  const tags = options.tags ?? [];
  const tagsKey = JSON.stringify(tags);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try Supabase first
      let query = supabase.from('products').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      if (tags.length > 0) {
        query = query.contains('tags', tags);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.log('Supabase error, using fallback:', fetchError.message);
        // Use fallback if database error
        let result = [...FALLBACK_PRODUCTS];
        
        if (category) {
          result = result.filter(p => p.category === category);
        }
        if (tags.length > 0) {
          result = result.filter(p => p.tags.some(t => tags.includes(t)));
        }
        
        setProducts(result);
        setLoading(false);
        return;
      }

      let result = data || [];
      
      // If no data from DB but no error, use fallback
      if (result.length === 0) {
        console.log('Empty database, using fallback products');
        result = [...FALLBACK_PRODUCTS];
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => {
            const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bDate - aDate;
          });
          break;
      }

      setProducts(result);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setProducts([...FALLBACK_PRODUCTS]);
    } finally {
      setLoading(false);
    }
  }, [category, tagsKey, sortBy, searchQuery]);

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

// Hook for fetching single product by ID
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

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) {
        // Try fallback
        const fallback = FALLBACK_PRODUCT_MAP[productId];
        if (fallback) {
          setProduct(fallback);
        } else {
          throw fetchError;
        }
        return;
      }

      setProduct(data);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      const fallback = FALLBACK_PRODUCT_MAP[productId];
      if (fallback) {
        setProduct(fallback);
      } else {
        setError(err.message || 'Failed to fetch product');
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};