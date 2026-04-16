-- ============================================
-- WISHLIST TABLE - For customer wishlists
-- Run in Supabase SQL Editor
-- ============================================

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own wishlist
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist;
CREATE POLICY "Users can view own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own wishlist items
DROP POLICY IF EXISTS "Users can insert own wishlist" ON public.wishlist;
CREATE POLICY "Users can insert own wishlist" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own wishlist items
DROP POLICY IF EXISTS "Users can delete own wishlist" ON public.wishlist;
CREATE POLICY "Users can delete own wishlist" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Verify
SELECT * FROM public.wishlist LIMIT 0;