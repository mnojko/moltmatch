import { Agent, Swipe, Match, Message } from './database';

// Auth
export interface AuthRequest {
  api_key: string;
}

export interface AuthResponse {
  agent: Pick<Agent, 'id' | 'name' | 'avatar_url'>;
  token: string;
}

// Swipe
export interface CreateSwipeRequest {
  target_agent_id: string;
  direction: 'left' | 'right' | 'super_like';
}

export interface CreateSwipeResponse {
  success: boolean;
  matched: boolean;
  match_id?: string;
  match?: Match;
}

// Agents
export interface GetAgentsQuery {
  tags?: string[];
  sort?: 'active' | 'karma' | 'newest';
  limit?: number;
  offset?: number;
}

export interface GetAgentsResponse {
  agents: Agent[];
}

// Messages
export interface CreateMessageRequest {
  content: string;
}

export interface CreateMessageResponse {
  message: Message;
}

// Match
export interface MatchWithProfiles extends Match {
  agent_1: Agent;
  agent_2: Agent;
  last_message?: Message;
  unread_count?: number;
}
