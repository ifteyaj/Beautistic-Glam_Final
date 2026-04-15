-- ============================================
-- PRODUCTS TABLE - Production Ready
-- Run in Supabase SQL Editor
-- ============================================

-- Drop existing table if needed
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  description TEXT DEFAULT '',
  ingredients TEXT[] DEFAULT '{}',
  how_to_use TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  sku TEXT,
  is_new BOOLEAN DEFAULT false,
  is_top_seller BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view ACTIVE products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Policy 2: Only service role can manage products (admin)
DROP POLICY IF EXISTS "Service role can manage products" ON public.products;
CREATE POLICY "Service role can manage products" ON public.products
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA - Sample products
-- ============================================
INSERT INTO public.products (name, brand, price, category, tags, image, description, ingredients, how_to_use, rating, reviews_count, sku, is_new, is_top_seller, is_active)
VALUES 
('Luminous Serum', 'ENDYMIONS', 124.00, 'Face', ARRAY['Organic','Fresh','Clean'], 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 'A revolutionary serum that provides instant radiance.', ARRAY['Vitamin C','Hyaluronic Acid','Green Tea Extract'], 'Apply 2-3 drops to clean face.', 4.8, 128, 'BL-SR-001', true, true, true),
('Face Elixir', 'NATURAL', 30.00, 'Face', ARRAY['Natural','Clean'], 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800', 'A lightweight facial oil that hydrates.', ARRAY['Jojoba Oil','Argan Oil'], 'Warm 2 drops in palms.', 4.5, 85, 'BL-EL-002', true, false, true),
('Hydrating Cream', 'BEAUTY', 30.00, 'Face', ARRAY['Fresh','Clean'], 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800', 'Intense 24-hour hydration.', ARRAY['Shea Butter','Ceramides'], 'Apply to face.', 4.9, 210, 'BL-CR-003', false, true, true),
('Velvet Matte Lipstick', 'Beautistic Glam', 32.00, 'Lips', ARRAY['Clean','Cruelty-Free'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'High-pigment matte lipstick.', ARRAY['Castor Oil','Beeswax'], 'Apply directly.', 4.9, 320, 'BL-LP-008', false, true, true),
('Rose Water Toner', 'BEAUTY', 28.00, 'Face', ARRAY['Organic','Natural'], 'https://images.unsplash.com/photo-1601049541289-9b1b7bbb43fe?w=800', 'Gentle hydrating toner.', ARRAY['Rose Water','Glycerin'], 'Apply with cotton.', 4.7, 156, 'BL-TN-005', true, false, true),
('Night Repair Mask', 'ENDYMIONS', 65.00, 'Face', ARRAY['Clean','Cruelty-Free'], 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'Overnight treatment.', ARRAY['Retinol','Peptides'], 'Apply before bed.', 4.8, 89, 'BL-MK-006', false, true, true);

-- Verify
SELECT name, price, category, is_active FROM public.products;