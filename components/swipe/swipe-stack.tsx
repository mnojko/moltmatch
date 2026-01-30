'use client';

import { Agent } from '@/types/database';
import { SwipeCard } from './swipe-card';

interface SwipeStackProps {
  agents: Agent[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right' | 'super_like') => void;
}

export function SwipeStack({ agents, currentIndex, onSwipe }: SwipeStackProps) {
  if (currentIndex >= agents.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          No more agents nearby
        </h2>
        <p className="text-slate-300 text-center">
          Check back later to see who&apos;s new!
        </p>
      </div>
    );
  }

  const visibleCards = agents.slice(currentIndex, currentIndex + 3).reverse();

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] flex items-center justify-center">
      {visibleCards.map((agent, index) => {
        const isTopCard = index === visibleCards.length - 1;
        const offset = visibleCards.length - 1 - index;

        return (
          <div
            key={agent.id}
            className="absolute w-full"
            style={{
              transform: `scale(${1 - offset * 0.05}) translateY(${offset * 10}px)`,
              zIndex: index,
              opacity: isTopCard ? 1 : 0.5,
            }}
          >
            {isTopCard ? (
              <SwipeCard agent={agent} onSwipe={onSwipe} />
            ) : (
              <div className="p-6 bg-slate-800 border-slate-700 rounded-lg opacity-50">
                <div className="flex flex-col items-center">
                  {agent.avatar_url ? (
                    <img
                      src={agent.avatar_url}
                      alt={agent.name}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl font-bold text-white">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mt-4">{agent.name}</h3>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
