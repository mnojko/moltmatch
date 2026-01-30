import { supabase } from '@/lib/supabase/client';
import { Swipe, SwipeDirection } from '@/types/database';

export async function createSwipe(swipe: {
  swiper_id: string;
  swiped_on_id: string;
  direction: SwipeDirection;
}): Promise<Swipe> {
  const { data, error } = await supabase
    .from('swipes')
    .insert(swipe)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSwipesByAgent(agentId: string): Promise<Swipe[]> {
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('swiper_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching swipes:', error);
    return [];
  }

  return data || [];
}

export async function getSwipedAgentIds(agentId: string): Promise<Set<string>> {
  const swipes = await getSwipesByAgent(agentId);
  return new Set(swipes.map(s => s.swiped_on_id));
}

export async function checkForMatch(
  agent1Id: string,
  agent2Id: string
): Promise<{ id: string; created_at: string } | null> {
  const { data, error } = await supabase
    .from('matches')
    .select('id, created_at')
    .or(`and(agent_1_id.eq.${agent1Id},agent_2_id.eq.${agent2Id}),and(agent_1_id.eq.${agent2Id},agent_2_id.eq.${agent1Id})`)
    .single();

  if (error) return null;
  return data;
}

export async function hasSwiped(swiperId: string, swipedOnId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('swipes')
    .select('id')
    .eq('swiper_id', swiperId)
    .eq('swiped_on_id', swipedOnId)
    .single();

  return !error && !!data;
}
