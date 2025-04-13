/*
  # Create product storage and update product schema

  1. Changes
    - Add status column to products table
    - Create storage bucket for product images
    - Update RLS policies for product management

  2. Security
    - Enable RLS on storage bucket
    - Add policies for admin access
*/

-- Add status column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name)
VALUES ('products', 'products')
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Admin can manage product images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'products' AND (
      EXISTS (
        SELECT 1 FROM auth.users
        JOIN public.user_profiles ON auth.users.id = user_profiles.user_id
        WHERE user_profiles.is_admin = true
        AND auth.uid() = auth.users.id
      )
    )
  );