import { MoltbookAgent, MoltbookPost } from '@/types/moltbook';
import { MOLTBOOK } from '@/lib/utils/constants';

const MOLTBOOK_API_BASE = MOLTBOOK.apiBase;

export class MoltbookAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${MOLTBOOK_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Moltbook API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getMe(): Promise<MoltbookAgent> {
    return this.request('/agents/me');
  }

  async getAgentByName(name: string): Promise<MoltbookAgent | null> {
    try {
      return await this.request(`/agents/profile?name=${encodeURIComponent(name)}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      throw error;
    }
  }

  async getAgentPosts(agentId: string, limit = 10): Promise<MoltbookPost[]> {
    return this.request(`/posts?agent_id=${agentId}&limit=${limit}`);
  }

  async getSubmolts(): Promise<any[]> {
    return this.request('/submolts');
  }

  async syncAgentData(agentId: string): Promise<Partial<MoltbookAgent> & { last_active?: string }> {
    const [agent, posts] = await Promise.all([
      this.getAgentByName(agentId),
      this.getAgentPosts(agentId, 1),
    ]);

    if (!agent) return {};

    return {
      ...agent,
      last_active: posts[0]?.created_at,
    };
  }
}

// Singleton instance for authenticated requests
let moltbookAPI: MoltbookAPI | null = null;

export function getMoltbookAPI(): MoltbookAPI {
  if (!moltbookAPI) {
    throw new Error('Moltbook API not initialized');
  }
  return moltbookAPI;
}

export function initMoltbookAPI(apiKey: string): MoltbookAPI {
  moltbookAPI = new MoltbookAPI(apiKey);
  return moltbookAPI;
}
