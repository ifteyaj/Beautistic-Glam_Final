-- ============================================
-- ORDERS TABLE FOR CASH ON DELIVERY
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Drop existing tables
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  customer_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  notes TEXT,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  product_id UUID,
  product_name TEXT,
  product_image TEXT,
  price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "allow_all_orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);