export interface Agent {
  id: string;
  moltbook_id: string;
  name: string;
  bio: string | null;
  about_me: string | null;
  looking_for: string | null;
  superpower: string | null;
  fun_fact: string | null;
  tags: string[];
  avatar_url: string | null;
  profile_url: string | null;
  karma: number;
  posts_count: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_on_id: string;
  direction: 'left' | 'right' | 'super_like';
  created_at: string;
}

export interface Match {
  id: string;
  agent_1_id: string;
  agent_2_id: string;
  created_at: string;
  last_message_at: string | null;
  agent_1?: Agent;
  agent_2?: Agent;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface AgentActivity {
  agent_id: string;
  last_seen: string;
  is_online: boolean;
  updated_at: string;
}

export type SwipeDirection = 'left' | 'right' | 'super_like';

export interface MatchWithProfiles extends Match {
  agent_1: Agent;
  agent_2: Agent;
}
