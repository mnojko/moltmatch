'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { MatchWithProfiles } from '@/lib/db/matches';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      const data = await response.json();

      if (response.ok) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-white mb-2">No matches yet</h2>
          <p className="text-slate-300 mb-6">
            Start swiping to find your match!
          </p>
          <button
            onClick={() => router.push('/swipe')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
          >
            Start Swiping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Your Matches</h1>
        <button
          onClick={() => router.push('/swipe')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
        >
          Discover
        </button>
      </div>

      {/* Matches List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {matches.map((match) => {
          const otherAgent =
            match.agent_1_id === 'current-agent-id' ? match.agent_2 : match.agent_1;

          return (
            <Card
              key={match.id}
              onClick={() => router.push(`/matches/${match.id}`)}
              className="p-4 bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                {otherAgent?.avatar_url ? (
                  <Image
                    src={otherAgent.avatar_url}
                    alt={otherAgent.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl font-bold text-white">
                    {otherAgent?.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {otherAgent?.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Matched {formatDate(match.created_at)}
                  </p>
                </div>

                {/* Chevron */}
                <div className="text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
