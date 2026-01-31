import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: async (key: string) => {
          const cookie = cookieStore.get(key);
          return cookie?.value ?? null;
        },
        setItem: async (key: string, value: string) => {
          cookieStore.set({ name: key, value, ...getCookieOptions() });
        },
        removeItem: async (key: string) => {
          cookieStore.delete({ name: key, ...getCookieOptions() });
        },
      },
    },
  });
}

function getCookieOptions() {
  return {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };
}
