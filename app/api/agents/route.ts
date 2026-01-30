import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAgent } from '@/lib/auth/session';
import { getAgents, updateAgent } from '@/lib/db/agents';
import { GetAgentsQuery, GetAgentsResponse } from '@/types/api';

// GET /api/agents - List agents (with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const sort = (searchParams.get('sort') as 'active' | 'karma' | 'newest') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const query: GetAgentsQuery = {
      tags,
      sort,
      limit,
      offset,
    };

    const agents = await getAgents(query);

    const response: GetAgentsResponse = { agents };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Update agent profile
export async function POST(request: NextRequest) {
  try {
    const agent = await getAuthenticatedAgent();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profileData = await request.json();

    // Validate required fields
    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Update profile
    const updatedAgent = await updateAgent(agent.id, profileData);

    return NextResponse.json({ agent: updatedAgent });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
