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

-- Drop insecure policies if they exist
DROP POLICY IF EXISTS "allow_all_orders" ON orders;
DROP POLICY IF EXISTS "allow_all_order_items" ON order_items;

-- Orders: Users can only view their own orders
CREATE POLICY "users_view_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_create_orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order Items: Access through orders table relationship
CREATE POLICY "users_view_own_order_items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admin policies (requires admin role in users table)
CREATE POLICY "admins_view_all_orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "admins_update_all_orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );