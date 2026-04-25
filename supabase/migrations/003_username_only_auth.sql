-- 003_username_only_auth.sql
-- Switch to username-only (anonymous) auth with 24h expiry on inactive usernames

-- =============================================
-- 1. ADD last_seen TO profiles
-- =============================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_seen timestamptz DEFAULT now();

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON profiles (last_seen);
-- Case-insensitive username uniqueness check
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles (lower(username));

-- =============================================
-- 2. ALLOW ANONYMOUS USERS TO INSERT THEIR PROFILE
-- (anonymous users have auth.uid() set, existing policy already covers this)
-- Update last_seen when user updates their own profile
-- =============================================

-- =============================================
-- 3. claim_username(p_username text)
-- Called right after signInAnonymously.
-- Returns 'ok' or 'taken'.
-- =============================================
CREATE OR REPLACE FUNCTION claim_username(p_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_user_id uuid;
  v_last_seen timestamptz;
BEGIN
  -- Normalize
  p_username := trim(p_username);

  IF length(p_username) < 2 OR length(p_username) > 20 THEN
    RETURN 'invalid';
  END IF;

  -- Check for existing active owner (case-insensitive)
  SELECT id, last_seen
    INTO v_existing_user_id, v_last_seen
    FROM profiles
   WHERE lower(username) = lower(p_username)
     AND id != auth.uid()
   LIMIT 1;

  IF FOUND THEN
    -- Username exists — is it stale (>24h with no activity)?
    IF v_last_seen < now() - interval '24 hours' THEN
      -- Safe to delete the old ghost user; cascade removes profile + roles
      DELETE FROM auth.users WHERE id = v_existing_user_id;
    ELSE
      -- Username is actively in use
      RETURN 'taken';
    END IF;
  END IF;

  -- Claim the username for the current anonymous user
  INSERT INTO profiles (id, username, full_name, avatar_url, last_seen)
  VALUES (
    auth.uid(),
    p_username,
    p_username,
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=' || p_username,
    now()
  )
  ON CONFLICT (id) DO UPDATE
    SET username   = EXCLUDED.username,
        full_name  = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        last_seen  = now();

  RETURN 'ok';
END;
$$;

-- =============================================
-- 4. update_last_seen() — called from client heartbeat via RPC
-- =============================================
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles SET last_seen = now() WHERE id = auth.uid();
$$;

-- =============================================
-- 5. cleanup_stale_users() — deletes auth.users whose profile
--    has last_seen older than 24h. Safe to call via pg_cron or manually.
-- =============================================
CREATE OR REPLACE FUNCTION cleanup_stale_users()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  WITH stale AS (
    SELECT id FROM profiles
     WHERE last_seen < now() - interval '24 hours'
  )
  DELETE FROM auth.users
   WHERE id IN (SELECT id FROM stale);

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- =============================================
-- 6. Schedule hourly cleanup (requires pg_cron extension)
--    Run in Supabase SQL editor once if pg_cron is available:
--      SELECT cron.schedule('cleanup-stale-users', '0 * * * *', 'SELECT cleanup_stale_users()');
--    This migration skips it to avoid errors if pg_cron is not enabled.
-- =============================================
