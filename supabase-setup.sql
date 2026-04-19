-- ============================================
-- BEAUTISTIC GLAM - DATABASE SETUP
-- Complete database schema for production
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. USERS TABLE (links to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');


-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] DEFAULT '{}',
  how_to_use TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  is_new BOOLEAN DEFAULT false,
  is_top_seller BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view products (read-only)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- Only service role can insert/update products
DROP POLICY IF EXISTS "Service role can manage products" ON public.products;
CREATE POLICY "Service role can manage products" ON public.products
  FOR ALL USING (auth.role() = 'service_role');


-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_zip TEXT,
  shipping_country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role can manage all orders
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;
CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');


-- 4. ORDER_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own order items (via join)
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_id
      AND public.orders.user_id = auth.uid()
    )
  );

-- Users can insert their own order items
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
CREATE POLICY "Users can create order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_id
      AND public.orders.user_id = auth.uid()
    )
  );

-- Service role can manage order items
DROP POLICY IF EXISTS "Service role can manage order items" ON public.order_items;
CREATE POLICY "Service role can manage order items" ON public.order_items
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- 5. CART TABLE (for persistent cart)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
CREATE POLICY "Users can view own cart" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own cart
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- 6. SEED PRODUCTS DATA
-- ============================================
INSERT INTO public.products (name, brand, price, category, tags, image, description, ingredients, how_to_use, rating, reviews_count, sku, is_new, is_top_seller, stock)
VALUES 
  ('Luminous Serum', 'ENDYMIONS', 124.00, 'Serum', ARRAY['Organic', 'Fresh', 'Clean'], 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 'A revolutionary serum that provides instant radiance and long-term skin rejuvenation.', ARRAY['Vitamin C', 'Hyaluronic Acid', 'Green Tea Extract'], 'Apply 2-3 drops to clean face every morning and evening.', 4.8, 128, 'BL-SR-001', true, true, 100),
  ('Face Elixir', 'NATURAL', 30.00, 'Oil', ARRAY['Natural', 'Clean'], 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800', 'A lightweight facial oil that deeply hydrates without clogging pores.', ARRAY['Jojoba Oil', 'Argan Oil', 'Squalane'], 'Warm 2 drops in palms and press gently into skin.', 4.5, 85, 'BL-EL-002', true, false, 50),
  ('Hydrating Cream', 'BEAUTY', 30.00, 'Face', ARRAY['Fresh', 'Clean'], 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800', 'Intense 24-hour hydration for all skin types.', ARRAY['Shea Butter', 'Ceramides', 'Glycerin'], 'Apply to face and neck morning and night.', 4.9, 210, 'BL-CR-003', false, true, 200),
  ('Velvet Matte Lipstick', 'Beautistic Glam', 32.00, 'Lips', ARRAY['Clean', 'Cruelty-Free'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'High-pigment matte lipstick that feels like weightless silk.', ARRAY['Castor Oil', 'Beeswax', 'Vitamin E'], 'Apply directly to lips.', 4.9, 320, 'BL-LP-008', false, true, 150),
  ('Rose Water Toner', 'BEAUTY', 28.00, 'Face', ARRAY['Organic', 'Natural'], 'https://images.unsplash.com/photo-1601049541289-9b1b7bbb43fe?w=800', 'Gentle hydrating toner with pure rose water.', ARRAY['Rose Water', 'Glycerin', 'Aloe Vera'], 'Apply with cotton pad after cleansing.', 4.7, 156, 'BL-TN-005', true, false, 80),
  ('Night Repair Mask', 'ENDYMIONS', 65.00, 'Skincare', ARRAY['Clean', 'Cruelty-Free'], 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'Overnight treatment for deep skin repair.', ARRAY['Retinol', 'Peptides', 'Hyaluronic Acid'], 'Apply thin layer before bed.', 4.8, 89, 'BL-MK-006', false, true, 60)
ON CONFLICT DO NOTHING;


-- ============================================
-- Verify tables were created
-- ============================================
SELECT 
  table_name, 
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;