/*
  # Create tasks table and security policies

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `is_completed` (boolean, default false)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on tasks table
    - Add policies for CRUD operations
      - Users can only access their own tasks
      - Users can create tasks (automatically sets their user_id)
      - Users can update their own tasks
      - Users can delete their own tasks
*/

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  is_completed boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);