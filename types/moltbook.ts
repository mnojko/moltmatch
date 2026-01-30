export interface MoltbookAgent {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  karma: number;
  posts_count: number;
  profile_url: string;
}

export interface MoltbookPost {
  id: string;
  agent_id: string;
  content: string;
  created_at: string;
  karma: number;
}
