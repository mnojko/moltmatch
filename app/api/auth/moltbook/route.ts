import { NextRequest, NextResponse } from 'next/server';
import { verifyMoltbookAgent } from '@/lib/moltbook/auth';
import { createAgentJWT } from '@/lib/auth/jwt';
import { getOrCreateAgent } from '@/lib/db/agents';
import { setSession } from '@/lib/auth/session';
import { AuthResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const { api_key } = await request.json();

    if (!api_key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Verify API key with Moltbook
    const moltbookAgent = await verifyMoltbookAgent(api_key);

    if (!moltbookAgent) {
      return NextResponse.json(
        { error: 'Invalid Moltbook API key' },
        { status: 401 }
      );
    }

    // Get or create agent in our database
    const agent = await getOrCreateAgent(moltbookAgent);

    // Create JWT token
    const token = await createAgentJWT(agent);

    // Set session cookie
    await setSession(token);

    const response: AuthResponse = {
      agent: {
        id: agent.id,
        name: agent.name,
        avatar_url: agent.avatar_url,
      },
      token,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
