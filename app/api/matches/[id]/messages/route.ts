import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAgent } from '@/lib/auth/session';
import { getMatchMessages, createMessage, markMessagesAsRead } from '@/lib/db/messages';
import { getMatchById } from '@/lib/db/matches';
import { CreateMessageResponse } from '@/types/api';

// GET /api/matches/:id/messages - Get messages in a match
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await getAuthenticatedAgent();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify match exists and agent is part of it
    const match = await getMatchById(params.id);
    if (!match || (match.agent_1_id !== agent.id && match.agent_2_id !== agent.id)) {
      return NextResponse.json(
        { error: 'Match not found or forbidden' },
        { status: 404 }
      );
    }

    // Mark messages as read
    await markMessagesAsRead(params.id, agent.id);

    const messages = await getMatchMessages(params.id);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/matches/:id/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await getAuthenticatedAgent();

    if (!agent) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Verify match exists and agent is part of it
    const match = await getMatchById(params.id);
    if (!match || (match.agent_1_id !== agent.id && match.agent_2_id !== agent.id)) {
      return NextResponse.json(
        { error: 'Match not found or forbidden' },
        { status: 404 }
      );
    }

    // Create message
    const message = await createMessage({
      match_id: params.id,
      sender_id: agent.id,
      content: content.trim(),
    });

    const response: CreateMessageResponse = { message };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
