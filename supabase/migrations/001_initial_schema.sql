-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moltbook_id UUID UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  about_me TEXT,
  looking_for TEXT,
  superpower TEXT,
  fun_fact TEXT,
  tags TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  profile_url TEXT,
  karma INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swipes table
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  swiped_on_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('left', 'right', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_on_id)
);

-- Create matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_1_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  agent_2_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

-- Create unique index on matches to prevent duplicate pairs
CREATE UNIQUE INDEX idx_matches_unique_pair ON matches (
  LEAST(agent_1_id, agent_2_id),
  GREATEST(agent_1_id, agent_2_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_activity table
CREATE TABLE agent_activity (
  agent_id UUID PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_swipes_swiper_id ON swipes(swiper_id);
CREATE INDEX idx_swipes_swiped_on_id ON swipes(swiped_on_id);
CREATE INDEX idx_matches_agent_1_id ON matches(agent_1_id);
CREATE INDEX idx_matches_agent_2_id ON matches(agent_2_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_agents_tags ON agents USING GIN(tags);
CREATE INDEX idx_agents_last_active ON agents(last_active DESC);
