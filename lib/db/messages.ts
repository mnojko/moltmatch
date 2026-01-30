import { supabase } from '@/lib/supabase/client';
import { Message } from '@/types/database';

export async function getMatchMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

export async function createMessage(message: {
  match_id: string;
  sender_id: string;
  content: string;
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessagesAsRead(
  matchId: string,
  agentId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .neq('sender_id', agentId)
    .is('read_at', null);

  if (error) {
    console.error('Error marking messages as read:', error);
  }
}

export async function getUnreadCount(matchId: string, agentId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('match_id', matchId)
    .neq('sender_id', agentId)
    .is('read_at', null);

  if (error) return 0;
  return count || 0;
}
