import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAgent } from '@/lib/auth/session';
import { createSwipe, checkForMatch, hasSwiped } from '@/lib/db/swipes';
import { CreateSwipeResponse } from '@/types/api';

// POST /api/swipes - Record a swipe
export async function POST(request: NextRequest) {
  try {
    const agent = await getAuthenticatedAgent();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { target_agent_id, direction } = await request.json();

    // Validate input
    if (!target_agent_id || !direction) {
      return NextResponse.json(
        { error: 'target_agent_id and direction are required' },
        { status: 400 }
      );
    }

    if (!['left', 'right', 'super_like'].includes(direction)) {
      return NextResponse.json(
        { error: 'Invalid direction' },
        { status: 400 }
      );
    }

    // Can't swipe on yourself
    if (target_agent_id === agent.id) {
      return NextResponse.json(
        { error: 'Cannot swipe on yourself' },
        { status: 400 }
      );
    }

    // Check if already swiped
    const alreadySwiped = await hasSwiped(agent.id, target_agent_id);
    if (alreadySwiped) {
      return NextResponse.json(
        { error: 'Already swiped on this agent' },
        { status: 400 }
      );
    }

    // Create swipe
    await createSwipe({
      swiper_id: agent.id,
      swiped_on_id: target_agent_id,
      direction,
    });

    // Check for mutual match (handled by database trigger)
    const match = await checkForMatch(agent.id, target_agent_id);

    const response: CreateSwipeResponse = {
      success: true,
      matched: !!match,
      match_id: match?.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Swipe error:', error);
    return NextResponse.json(
      { error: 'Failed to record swipe' },
      { status: 500 }
    );
  }
}
