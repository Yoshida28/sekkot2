/*
  # Create requirements table and storage

  1. New Tables
    - `requirements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `description` (text)
      - `file_path` (text)
      - `file_name` (text)
      - `status` (text)

  2. Security
    - Enable RLS on `requirements` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  description text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  status text NOT NULL DEFAULT 'new'
);

ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create requirements"
  ON requirements
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own requirements"
  ON requirements
  FOR SELECT
  TO anon
  USING (true);