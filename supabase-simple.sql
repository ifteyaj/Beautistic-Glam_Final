-- ============================================
-- SIMPLE VERSION - Run each section separately
-- ============================================

-- SECTION 1: USERS TABLE
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "u1" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "u2" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "u3" ON public.users FOR UPDATE USING (auth.uid() = id);

-- SECTION 2: PRODUCTS TABLE  
DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] DEFAULT '{}',
  how_to_use TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  sku TEXT,
  is_new BOOLEAN DEFAULT false,
  is_top_seller BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "p1" ON public.products FOR SELECT USING (true);

-- SECTION 3: CART TABLE
DROP TABLE IF EXISTS public.cart_items CASCADE;
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "c1" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "c2" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- SECTION 4: ORDERS TABLE
DROP TABLE IF EXISTS public.orders CASCADE;
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_zip TEXT,
  shipping_country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "o1" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "o2" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Now insert products (after table exists)
INSERT INTO public.products (name, brand, price, category, tags, image, description, ingredients, how_to_use, rating, reviews_count, sku, is_new, is_top_seller, stock)
VALUES 
('Luminous Serum', 'ENDYMIONS', 124.00, 'Serum', ARRAY['Organic','Fresh','Clean'], 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 'A revolutionary serum that provides instant radiance.', ARRAY['Vitamin C','Hyaluronic Acid'], 'Apply 2-3 drops to clean face.', 4.8, 128, 'BL-SR-001', true, true, 100),
('Face Elixir', 'NATURAL', 30.00, 'Oil', ARRAY['Natural','Clean'], 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800', 'A lightweight facial oil.', ARRAY['Jojoba Oil','Argan Oil'], 'Warm 2 drops in palms.', 4.5, 85, 'BL-EL-002', true, false, 50),
('Hydrating Cream', 'BEAUTY', 30.00, 'Face', ARRAY['Fresh','Clean'], 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800', 'Intense 24-hour hydration.', ARRAY['Shea Butter','Ceramides'], 'Apply to face.', 4.9, 210, 'BL-CR-003', false, true, 200),
('Velvet Matte Lipstick', 'Beautistic Glam', 32.00, 'Lips', ARRAY['Clean','Cruelty-Free'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'High-pigment matte lipstick.', ARRAY['Castor Oil','Beeswax'], 'Apply directly to lips.', 4.9, 320, 'BL-LP-008', false, true, 150),
('Rose Water Toner', 'BEAUTY', 28.00, 'Face', ARRAY['Organic','Natural'], 'https://images.unsplash.com/photo-1601049541289-9b1b7bbb43fe?w=800', 'Gentle hydrating toner.', ARRAY['Rose Water','Glycerin'], 'Apply with cotton pad.', 4.7, 156, 'BL-TN-005', true, false, 80),
('Night Repair Mask', 'ENDYMIONS', 65.00, 'Skincare', ARRAY['Clean','Cruelty-Free'], 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'Overnight treatment.', ARRAY['Retinol','Peptides'], 'Apply thin layer before bed.', 4.8, 89, 'BL-MK-006', false, true, 60);

-- Verify
SELECT name, category, price FROM public.products;