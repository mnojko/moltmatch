import { NextRequest, NextResponse } from 'next/server';
import { getTrendingMatches } from '@/lib/db/matches';

// GET /api/matches/trending - Public trending matches
export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    const matches = await getTrendingMatches(limit);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Get trending matches error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending matches' },
      { status: 500 }
    );
  }
}
