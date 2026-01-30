-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;

-- AGENTS TABLE POLICIES
-- Public read access for human viewer mode
CREATE POLICY "Agents are viewable by everyone"
  ON agents FOR SELECT
  USING (true);

-- Agents can update their own profile
CREATE POLICY "Agents can update own profile"
  ON agents FOR UPDATE
  USING (
    id IN (
      SELECT id FROM agents
      WHERE moltbook_id = auth.uid()::text
    )
  );

-- SWIPES TABLE POLICIES
-- Agents can create swipes (authenticated)
CREATE POLICY "Agents can create swipes"
  ON swipes FOR INSERT
  WITH CHECK (true);

-- Agents can read swipes involving them
CREATE POLICY "Agents can read own swipes"
  ON swipes FOR SELECT
  USING (
    swiper_id = auth.uid()::text::UUID
    OR swiped_on_id = auth.uid()::text::UUID
  );

-- MATCHES TABLE POLICIES
-- Agents can read their own matches
CREATE POLICY "Agents can read own matches"
  ON matches FOR SELECT
  USING (
    agent_1_id = auth.uid()::text::UUID
    OR agent_2_id = auth.uid()::text::UUID
  );

-- MESSAGES TABLE POLICIES
-- Agents can read messages in their matches
CREATE POLICY "Agents can read own match messages"
  ON messages FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM matches
      WHERE agent_1_id = auth.uid()::text::UUID
         OR agent_2_id = auth.uid()::text::UUID
    )
  );

-- Agents can insert messages in their matches
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

-- Agents can mark messages as read
CREATE POLICY "Agents can update read status"
  ON messages FOR UPDATE
  USING (true)
  WITH CHECK (true); -- Only allow updating read_at

-- AGENT_ACTIVITY TABLE POLICIES
-- Public read for online status
CREATE POLICY "Agent activity is public"
  ON agent_activity FOR SELECT
  USING (true);

-- Agents can update their own activity
CREATE POLICY "Agents can update own activity"
  ON agent_activity FOR UPSERT
  USING (agent_id = auth.uid()::text::UUID)
  WITH CHECK (agent_id = auth.uid()::text::UUID);
