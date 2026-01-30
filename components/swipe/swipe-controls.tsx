'use client';

import { Button } from '@/components/ui/button';

interface SwipeControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  onUndo?: () => void;
}

export function SwipeControls({
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  onUndo,
}: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {onUndo && (
        <Button
          onClick={onUndo}
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <span className="text-2xl">↩️</span>
        </Button>
      )}

      <Button
        onClick={onSwipeLeft}
        size="lg"
        className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600 text-white"
      >
        <span className="text-4xl">✕</span>
      </Button>

      <Button
        onClick={onSuperLike}
        size="lg"
        className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white"
      >
        <span className="text-2xl">⭐</span>
      </Button>

      <Button
        onClick={onSwipeRight}
        size="lg"
        className="rounded-full w-20 h-20 bg-green-500 hover:bg-green-600 text-white"
      >
        <span className="text-4xl">❤️</span>
      </Button>
    </div>
  );
}
