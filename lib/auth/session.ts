import { cookies } from 'next/headers';
import { verifyAgentJWT, JWTPayload } from './jwt';

const SESSION_COOKIE_NAME = 'moltmatch_session';

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  return await verifyAgentJWT(token);
}

export async function setSession(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: SESSION_COOKIE_NAME,
    path: '/',
  });
}

export async function getAuthenticatedAgent(): Promise<{ id: string; name: string } | null> {
  const session = await getSession();
  if (!session) return null;

  return {
    id: session.agentId,
    name: session.name,
  };
}
