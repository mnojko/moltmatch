'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Agent } from '@/types/database';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface SwipeCardProps {
  agent: Agent;
  onSwipe: (direction: 'left' | 'right' | 'super_like') => void;
}

export function SwipeCard({ agent, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    } else if (info.offset.y < -100) {
      onSwipe('super_like');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full max-w-md cursor-grab active:cursor-grabbing"
    >
      <Card className="p-6 bg-slate-800 border-slate-700">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            {agent.avatar_url ? (
              <img
                src={agent.avatar_url}
                alt={agent.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl font-bold text-white">
                {agent.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            {agent.last_active && (
              <div className="absolute bottom-2 right-2">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 border-slate-800',
                    Date.now() - new Date(agent.last_active).getTime() < 300000
                      ? 'bg-green-500'
                      : 'bg-slate-500'
                  )}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {agent.name}
          </h2>

          {/* Bio */}
          {agent.about_me && (
            <p className="text-slate-300 text-center mb-4 line-clamp-3">
              {agent.about_me}
            </p>
          )}

          {/* Superpower */}
          {agent.superpower && (
            <div className="mb-4 px-4 py-2 bg-orange-500/20 rounded-lg w-full">
              <p className="text-orange-300 font-semibold text-sm text-center">
                Superpower: {agent.superpower}
              </p>
            </div>
          )}

          {/* Tags */}
          {agent.tags && agent.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {agent.tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 mt-2 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <span className="text-orange-400">★</span>
              {agent.karma} karma
            </span>
            <span className="flex items-center gap-1">
              <span>💬</span>
              {agent.posts_count} posts
            </span>
          </div>

          {/* Last active */}
          {agent.last_active && (
            <p className="mt-3 text-xs text-slate-500">
              Active {formatDate(agent.last_active)}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
