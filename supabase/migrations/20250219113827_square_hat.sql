/*
  # Create words table for pronunciation practice

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `word` (text)
      - `ipa` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `words` table
    - Add policies for authenticated users to:
      - Read their own words
      - Create new words
      - Delete their own words
*/

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  word text NOT NULL,
  ipa text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own words"
  ON words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create words"
  ON words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own words"
  ON words
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);