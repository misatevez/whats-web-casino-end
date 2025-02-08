/*
  # Initial Schema Setup

  1. New Tables
    - `chats`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone_number` (text, unique)
      - `last_message` (text)
      - `time` (text)
      - `unread` (integer)
      - `avatar` (text)
      - `online` (boolean)
      - `about` (text)
      - `last_message_time` (timestamptz)
      - `created_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, foreign key)
      - `content` (text)
      - `time` (text)
      - `sent` (boolean)
      - `status` (text)
      - `preview` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text UNIQUE NOT NULL,
  last_message text DEFAULT '',
  time text,
  unread integer DEFAULT 0,
  avatar text,
  online boolean DEFAULT false,
  about text DEFAULT 'Hey there! I am using WhatsApp',
  last_message_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  content text,
  time text NOT NULL,
  sent boolean DEFAULT true,
  status text DEFAULT 'sent',
  preview jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chats
CREATE POLICY "Allow all users to read chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all users to insert chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all users to update chats"
  ON chats
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for messages
CREATE POLICY "Allow all users to read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all users to insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all users to update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS chats_phone_number_idx ON chats(phone_number);
CREATE INDEX IF NOT EXISTS chats_last_message_time_idx ON chats(last_message_time DESC);
CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON messages(chat_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);