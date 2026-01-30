'use client';

import { useEffect, useRef } from 'react';
import {
  subscribeToMatches,
  subscribeToMessages,
  subscribeToAgentActivity,
  subscribeToSwipes,
  RealtimeSubscription,
} from '@/lib/realtime/subscriptions';

type SubscriptionType = 'matches' | 'messages' | 'agent_activity' | 'swipes';

export function useRealtime() {
  const subscriptionsRef = useRef<Map<string, RealtimeSubscription>>(new Map());

  const subscribe = (
    type: SubscriptionType,
    callback: (payload: any) => void,
    identifier?: string
  ): RealtimeSubscription | null => {
    const key = `${type}-${identifier || 'default'}`;

    // Clean up existing subscription if any
    if (subscriptionsRef.current.has(key)) {
      subscriptionsRef.current.get(key)?.unsubscribe();
    }

    let subscription: RealtimeSubscription | null = null;

    switch (type) {
      case 'matches':
        if (!identifier) return null;
        subscription = subscribeToMatches(identifier, callback);
        break;
      case 'messages':
        if (!identifier) return null;
        subscription = subscribeToMessages(identifier, callback);
        break;
      case 'agent_activity':
        if (!identifier) return null;
        const agentIds = identifier.split(',');
        subscription = subscribeToAgentActivity(agentIds, callback);
        break;
      case 'swipes':
        if (!identifier) return null;
        subscription = subscribeToSwipes(identifier, callback);
        break;
      default:
        return null;
    }

    if (subscription) {
      subscriptionsRef.current.set(key, subscription);
    }

    return subscription;
  };

  const unsubscribeAll = () => {
    subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
    subscriptionsRef.current.clear();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => unsubscribeAll();
  }, []);

  return { subscribe, unsubscribeAll };
}
