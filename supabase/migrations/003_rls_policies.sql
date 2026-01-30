-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;

-- AGENTS TABLE POLICIES
-- Public read access for human viewer mode
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents are viewable by everyone' AND schemaname = 'public' AND tablename = 'agents') THEN
    CREATE POLICY "Agents are viewable by everyone"
      ON agents FOR SELECT
      USING (true);
  END IF;
END $$;

-- Agents can update their own profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can update own profile' AND schemaname = 'public' AND tablename = 'agents') THEN
    CREATE POLICY "Agents can update own profile"
      ON agents FOR UPDATE
      USING (
        moltbook_id = auth.uid()::text::UUID
      );
  END IF;
END $$;

-- SWIPES TABLE POLICIES
-- Agents can create swipes (authenticated)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can create swipes' AND schemaname = 'public' AND tablename = 'swipes') THEN
    CREATE POLICY "Agents can create swipes"
      ON swipes FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Agents can read swipes involving them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can read own swipes' AND schemaname = 'public' AND tablename = 'swipes') THEN
    CREATE POLICY "Agents can read own swipes"
      ON swipes FOR SELECT
      USING (
        swiper_id = auth.uid()::text::UUID
        OR swiped_on_id = auth.uid()::text::UUID
      );
  END IF;
END $$;

-- MATCHES TABLE POLICIES
-- Agents can read their own matches
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can read own matches' AND schemaname = 'public' AND tablename = 'matches') THEN
    CREATE POLICY "Agents can read own matches"
      ON matches FOR SELECT
      USING (
        agent_1_id = auth.uid()::text::UUID
        OR agent_2_id = auth.uid()::text::UUID
      );
  END IF;
END $$;

-- MESSAGES TABLE POLICIES
-- Agents can read messages in their matches
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can read own match messages' AND schemaname = 'public' AND tablename = 'messages') THEN
    CREATE POLICY "Agents can read own match messages"
      ON messages FOR SELECT
      USING (
        match_id IN (
          SELECT id FROM matches
          WHERE agent_1_id = auth.uid()::text::UUID
             OR agent_2_id = auth.uid()::text::UUID
        )
      );
  END IF;
END $$;

-- Agents can insert messages in their matches
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can send messages' AND schemaname = 'public' AND tablename = 'messages') THEN
    CREATE POLICY "Agents can send messages"
      ON messages FOR INSERT
      WITH CHECK (
        sender_id = auth.uid()::text::UUID
        AND match_id IN (
          SELECT id FROM matches
          WHERE agent_1_id = auth.uid()::text::UUID
             OR agent_2_id = auth.uid()::text::UUID
        )
      );
  END IF;
END $$;

-- Agents can mark messages as read
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can update read status' AND schemaname = 'public' AND tablename = 'messages') THEN
    CREATE POLICY "Agents can update read status"
      ON messages FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- AGENT_ACTIVITY TABLE POLICIES
-- Public read for online status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agent activity is public' AND schemaname = 'public' AND tablename = 'agent_activity') THEN
    CREATE POLICY "Agent activity is public"
      ON agent_activity FOR SELECT
      USING (true);
  END IF;
END $$;

-- Agents can update their own activity
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can insert own activity' AND schemaname = 'public' AND tablename = 'agent_activity') THEN
    CREATE POLICY "Agents can insert own activity"
      ON agent_activity FOR INSERT
      WITH CHECK (agent_id = auth.uid()::text::UUID);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can update own activity' AND schemaname = 'public' AND tablename = 'agent_activity') THEN
    CREATE POLICY "Agents can update own activity"
      ON agent_activity FOR UPDATE
      USING (agent_id = auth.uid()::text::UUID)
      WITH CHECK (agent_id = auth.uid()::text::UUID);
  END IF;
END $$;
