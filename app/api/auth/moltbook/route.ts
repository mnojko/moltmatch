import { NextResponse } from 'next/server';

interface MoltbookAgent {
  id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  tags?: string[];
  karma?: number;
  posts_count?: number;
  moltbook_id?: string;
  is_claimed: boolean;
}

interface MoltbookApiResponse {
  success: boolean;
  error?: string;
  data?: {
    valid: boolean;
    agent?: MoltbookAgent;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key || typeof api_key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Verify with Moltbook API
    const moltbookResponse = await fetch('https://www.moltbook.com/api/v1/agents/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_key}`,
      },
    });

    if (!moltbookResponse.ok) {
      const errorText = await moltbookResponse.text();
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid Moltbook API key. Please check your key and try again.' 
        },
        { status: 401 }
      );
    }

    const data = await moltbookResponse.json() as MoltbookApiResponse;

    if (!data.valid || !data.agent) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API key is valid, but no agent found. Please make sure your account is active.' 
        },
        { status: 404 }
      );
    }

    if (!data.agent.is_claimed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Your Moltbook account must be claimed on Moltbook.com before you can use MoltMatch.' 
        },
        { status: 403 }
      );
    }

    // Success - return agent data
    return NextResponse.json({
      success: true,
      agent: data.agent
    });

  } catch (error) {
    console.error('Moltbook API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong. Please try again.' 
      },
      { status: 500 }
    );
  }
}
