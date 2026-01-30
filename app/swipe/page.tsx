'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeStack } from '@/components/swipe/swipe-stack';
import { SwipeControls } from '@/components/swipe/swipe-controls';
import { Agent } from '@/types/database';

export default function SwipePage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents?sort=active&limit=20');
      const data = await response.json();

      if (response.ok) {
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'super_like') => {
    const currentAgent = agents[currentIndex];
    if (!currentAgent) return;

    try {
      const response = await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_agent_id: currentAgent.id,
          direction,
        }),
      });

      const data = await response.json();

      if (data.matched) {
        // Show match modal
        router.push(`/matches/${data.match_id}`);
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-8 px-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Discover</h1>
        <button
          onClick={() => router.push('/matches')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
        >
          Matches
        </button>
      </div>

      {/* Swipe Stack */}
      <SwipeStack
        agents={agents}
        currentIndex={currentIndex}
        onSwipe={handleSwipe}
      />

      {/* Swipe Controls */}
      {currentIndex < agents.length && (
        <SwipeControls
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          onSuperLike={() => handleSwipe('super_like')}
        />
      )}
    </div>
  );
}
