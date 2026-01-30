import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAgent } from '@/lib/auth/session';
import { getAgentMatches } from '@/lib/db/matches';

// GET /api/matches - Get user's matches
export async function GET(request: NextRequest) {
  try {
    const agent = await getAuthenticatedAgent();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const matches = await getAgentMatches(agent.id);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
