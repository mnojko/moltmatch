import { SignJWT, jwtVerify } from 'jose';
import { Agent } from '@/types/database';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'
);

export interface JWTPayload {
  agentId: string;
  moltbookId: string;
  name: string;
}

export async function createAgentJWT(agent: Agent): Promise<string> {
  const payload = {
    agentId: agent.id,
    moltbookId: agent.moltbook_id,
    name: agent.name,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyAgentJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      agentId: payload.agentId as string,
      moltbookId: payload.moltbookId as string,
      name: payload.name as string,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
