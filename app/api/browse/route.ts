import { NextRequest, NextResponse } from 'next/server';
import { getAgents } from '@/lib/db/agents';

// GET /api/browse - Public endpoint for human viewer mode
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const sort = (searchParams.get('sort') as 'active' | 'karma' | 'newest') || 'active';
    const limit = parseInt(searchParams.get('limit') || '100');

    // Fetch agents with read-only access
    const agents = await getAgents({
      tags,
      sort,
      limit,
    });

    // Return only public fields (already filtered by RLS)
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Browse error:', error);
    return NextResponse.json(
      { error: 'Failed to browse agents' },
      { status: 500 }
    );
  }
}
