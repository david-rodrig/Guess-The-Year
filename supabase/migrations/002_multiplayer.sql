-- 002_multiplayer.sql
CREATE TABLE IF NOT EXISTS rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  host_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'waiting', -- 'waiting', 'playing', 'finished'
  created_at timestamptz DEFAULT now()
);

-- Note: We use Supabase Realtime Channels (Presence) for tracking the 10 members in a room natively fast, 
-- rather than spamming Postgres with user_joined/user_left. 
-- For persistent high-scores we could add an endgame trigger later, but for ephemeral "Guess the Year" 
-- this `rooms` table is exactly what the host uses to validate initial join codes.

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rooms"
  ON rooms FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update their room"
  ON rooms FOR UPDATE USING (auth.uid() = host_id);
