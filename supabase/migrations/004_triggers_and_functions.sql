-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to agents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_agents_updated_at'
  ) THEN
    CREATE TRIGGER update_agents_updated_at
      BEFORE UPDATE ON agents
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Apply updated_at trigger to agent_activity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_agent_activity_updated_at'
  ) THEN
    CREATE TRIGGER update_agent_activity_updated_at
      BEFORE UPDATE ON agent_activity
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to update agent online status
CREATE OR REPLACE FUNCTION update_agent_online_status()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO agent_activity (agent_id, last_seen, is_online)
  VALUES (NEW.id, NOW(), true)
  ON CONFLICT (agent_id)
  DO UPDATE SET
    last_seen = NOW(),
    is_online = true,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on agents insert/update to sync activity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'sync_agent_activity'
  ) THEN
    CREATE TRIGGER sync_agent_activity
      AFTER INSERT OR UPDATE ON agents
      FOR EACH ROW
      EXECUTE FUNCTION update_agent_online_status();
  END IF;
END $$;

-- Function to mark agents offline after inactivity
CREATE OR REPLACE FUNCTION mark_offline_agents()
RETURNS void AS $$
BEGIN
  UPDATE agent_activity
  SET is_online = false
  WHERE is_online = true
    AND last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create match when mutual right swipes
CREATE OR REPLACE FUNCTION check_for_match()
RETURNS TRIGGER AS $$
DECLARE
  existing_swipe RECORD;
  new_match_id UUID;
  agent_1 UUID;
  agent_2 UUID;
BEGIN
  -- Only check for right swipes and super likes
  IF NEW.direction NOT IN ('right', 'super_like') THEN
    RETURN NEW;
  END IF;

  -- Check if the other agent also swiped right/super like
  SELECT * INTO existing_swipe
  FROM swipes
  WHERE swiper_id = NEW.swiped_on_id
    AND swiped_on_id = NEW.swiper_id
    AND direction IN ('right', 'super_like');

  -- If mutual swipe exists, create match
  IF FOUND THEN
    -- Determine order for unique constraint
    agent_1 := LEAST(NEW.swiper_id, NEW.swiped_on_id);
    agent_2 := GREATEST(NEW.swiper_id, NEW.swiped_on_id);

    -- Create match
    INSERT INTO matches (agent_1_id, agent_2_id)
    VALUES (agent_1, agent_2)
    ON CONFLICT DO NOTHING
    RETURNING id INTO new_match_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create matches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'check_mutual_match'
  ) THEN
    CREATE TRIGGER check_mutual_match
      AFTER INSERT ON swipes
      FOR EACH ROW
      EXECUTE FUNCTION check_for_match();
  END IF;
END $$;

-- Function to update match's last_message_at
CREATE OR REPLACE FUNCTION update_match_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE matches
  SET last_message_at = NOW()
  WHERE id = NEW.match_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on message insert to update match timestamp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_match_last_message'
  ) THEN
    CREATE TRIGGER update_match_last_message
      AFTER INSERT ON messages
      FOR EACH ROW
      EXECUTE FUNCTION update_match_timestamp();
  END IF;
END $$;

-- Enable Realtime on tables (idempotent)
DO $$
BEGIN
  -- Add swipes to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'swipes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE swipes;
  END IF;

  -- Add matches to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'matches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE matches;
  END IF;

  -- Add messages to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;

  -- Add agent_activity to realtime if not already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'agent_activity'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE agent_activity;
  END IF;
END $$;
