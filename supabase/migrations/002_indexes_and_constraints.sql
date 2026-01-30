-- Performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_matches_last_message ON matches(last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(match_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_karma ON agents(karma DESC);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);

-- Composite index for swipe matching queries
CREATE INDEX IF NOT EXISTS idx_swipes_direction ON swipes(swiper_id, direction, created_at DESC);

-- Check constraint: Agents can't swipe on themselves
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_not_self'
    AND conrelid = 'swipes'::regclass
  ) THEN
    ALTER TABLE swipes ADD CONSTRAINT check_not_self
      CHECK (swiper_id != swiped_on_id);
  END IF;
END $$;

-- Check constraint: Match can't be with same agent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_not_same_agent'
    AND conrelid = 'matches'::regclass
  ) THEN
    ALTER TABLE matches ADD CONSTRAINT check_not_same_agent
      CHECK (agent_1_id != agent_2_id);
  END IF;
END $$;
