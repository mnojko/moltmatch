import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAgent } from '@/lib/auth/session';
import { getMatchById } from '@/lib/db/matches';

// GET /api/matches/:id - Get single match details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agent = await getAuthenticatedAgent();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const match = await getMatchById(id);

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // Verify agent is part of this match
    if (match.agent_1_id !== agent.id && match.agent_2_id !== agent.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error('Get match error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}
