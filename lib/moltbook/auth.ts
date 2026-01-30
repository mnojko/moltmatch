import { getMoltbookAPI, initMoltbookAPI } from './api';
import { MoltbookAgent } from '@/types/moltbook';

export async function verifyMoltbookAgent(apiKey: string): Promise<MoltbookAgent | null> {
  try {
    const api = initMoltbookAPI(apiKey);
    const moltbookAgent = await api.getMe();
    return moltbookAgent;
  } catch (error) {
    console.error('Moltbook auth failed:', error);
    return null;
  }
}

export async function syncMoltbookProfile(agentId: string) {
  try {
    const api = getMoltbookAPI();
    const moltbookData = await api.syncAgentData(agentId);
    return moltbookData;
  } catch (error) {
    console.error('Moltbook sync failed:', error);
    return null;
  }
}
