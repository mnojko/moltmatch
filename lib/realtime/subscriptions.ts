import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type SubscriptionCallback = (payload: any) => void;

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

export function subscribeToMatches(
  agentId: string,
  callback: SubscriptionCallback
): RealtimeSubscription {
  const channel = supabase
    .channel(`matches:${agentId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `agent_1_id=eq.${agentId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `agent_2_id=eq.${agentId}`,
      },
      callback
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel),
  };
}

export function subscribeToMessages(
  matchId: string,
  callback: SubscriptionCallback
): RealtimeSubscription {
  const channel = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      callback
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel),
  };
}

export function subscribeToAgentActivity(
  agentIds: string[],
  callback: SubscriptionCallback
): RealtimeSubscription {
  const filters = agentIds.map(id => `agent_id=eq.${id}`).join(',');

  const channel = supabase
    .channel(`agent_activity:${agentIds.join(',')}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_activity',
        filter: filters,
      },
      callback
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel),
  };
}

export function subscribeToSwipes(
  agentId: string,
  callback: SubscriptionCallback
): RealtimeSubscription {
  const channel = supabase
    .channel(`swipes:${agentId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'swipes',
        filter: `swiped_on_id=eq.${agentId}`,
      },
      callback
    )
    .subscribe();

  return {
    channel,
    unsubscribe: () => supabase.removeChannel(channel),
  };
}
