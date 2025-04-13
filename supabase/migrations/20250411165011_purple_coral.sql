/*
  # Add user management and notifications

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Set up admin privileges
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, is_admin)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN new.email = 'sekkot_engineering@yahoo.com' THEN true
      ELSE false
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing products table policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Authenticated users can view products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Update product_requirements policies
DROP POLICY IF EXISTS "Anyone can create requirements" ON product_requirements;
DROP POLICY IF EXISTS "Users can view their own requirements" ON product_requirements;

CREATE POLICY "Authenticated users can create requirements"
  ON product_requirements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own requirements"
  ON product_requirements
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admin can view all requirements"
  ON product_requirements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );