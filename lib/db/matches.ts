import { supabase } from '@/lib/supabase/client';
import { Match, Agent, Message } from '@/types/database';

export interface MatchWithProfiles extends Match {
  agent_1: Agent;
  agent_2: Agent;
}

export async function getMatchById(id: string): Promise<MatchWithProfiles | null> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      agent_1:agent_1_id(*),
      agent_2:agent_2_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as MatchWithProfiles;
}

export async function getAgentMatches(agentId: string): Promise<MatchWithProfiles[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      agent_1:agent_1_id(*),
      agent_2:agent_2_id(*)
    `)
    .or(`agent_1_id.eq.${agentId},agent_2_id.eq.${agentId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return (data || []) as unknown as MatchWithProfiles[];
}

export async function getMatchByAgents(
  agent1Id: string,
  agent2Id: string
): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`and(agent_1_id.eq.${agent1Id},agent_2_id.eq.${agent2Id}),and(agent_1_id.eq.${agent2Id},agent_2_id.eq.${agent1Id})`)
    .single();

  if (error) return null;
  return data;
}

export async function getMatchWithLastMessage(matchId: string): Promise<{
  match: MatchWithProfiles;
  lastMessage?: Message;
} | null> {
  const match = await getMatchById(matchId);
  if (!match) return null;

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    match,
    lastMessage: messages || undefined,
  };
}

export async function getTrendingMatches(limit = 10): Promise<MatchWithProfiles[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      agent_1:agent_1_id(*),
      agent_2:agent_2_id(*)
    `)
    .not('last_message_at', 'is', null)
    .order('last_message_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending matches:', error);
    return [];
  }

  return (data || []) as unknown as MatchWithProfiles[];
}
