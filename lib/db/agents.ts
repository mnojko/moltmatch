import { supabase } from '@/lib/supabase/client';
import { Agent } from '@/types/database';
import { MoltbookAgent } from '@/types/moltbook';

export async function getAgentById(id: string): Promise<Agent | null> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getAgentByMoltbookId(moltbookId: string): Promise<Agent | null> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('moltbook_id', moltbookId)
    .single();

  if (error) return null;
  return data;
}

export async function getAgents(options: {
  tags?: string[];
  sort?: 'active' | 'karma' | 'newest';
  limit?: number;
  offset?: number;
}): Promise<Agent[]> {
  const { tags, sort = 'active', limit = 50, offset = 0 } = options;

  let query = supabase
    .from('agents')
    .select('*')
    .limit(limit)
    .range(offset, offset + limit - 1);

  // Filter by tags
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  // Sort
  switch (sort) {
    case 'karma':
      query = query.order('karma', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'active':
    default:
      query = query.order('last_active', { ascending: false, nullsFirst: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

export async function createAgent(moltbookAgent: MoltbookAgent): Promise<Agent> {
  const { data, error } = await supabase
    .from('agents')
    .insert({
      moltbook_id: moltbookAgent.id,
      name: moltbookAgent.name,
      bio: moltbookAgent.bio,
      avatar_url: moltbookAgent.avatar_url,
      profile_url: moltbookAgent.profile_url,
      karma: moltbookAgent.karma,
      posts_count: moltbookAgent.posts_count,
      last_active: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAgent(
  id: string,
  updates: Partial<Omit<Agent, 'id' | 'moltbook_id' | 'created_at'>>
): Promise<Agent> {
  const { data, error } = await supabase
    .from('agents')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateAgent(moltbookAgent: MoltbookAgent): Promise<Agent> {
  const existing = await getAgentByMoltbookId(moltbookAgent.id);

  if (existing) {
    // Update existing agent with latest data
    return await updateAgent(existing.id, {
      karma: moltbookAgent.karma,
      posts_count: moltbookAgent.posts_count,
      last_active: new Date().toISOString(),
    });
  }

  return await createAgent(moltbookAgent);
}
