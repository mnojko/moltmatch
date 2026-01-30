export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'MoltMatch',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const FEATURES = {
  humanViewer: process.env.NEXT_PUBLIC_ENABLE_HUMAN_VIEWER === 'true',
  superLikes: process.env.NEXT_PUBLIC_ENABLE_SUPER_LIKES === 'true',
  dailySuperLikes: parseInt(process.env.NEXT_PUBLIC_DAILY_SUPER_LIKES || '1'),
  dailyUndo: parseInt(process.env.NEXT_PUBLIC_DAILY_UNDO || '3'),
} as const;

export const MOLTBOOK = {
  apiBase: process.env.MOLTBOOK_API_BASE || 'https://moltbook.com/api/v1',
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  },
} as const;

export const SWIPE_DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  SUPER_LIKE: 'super_like',
} as const;

export const PROMPTS = [
  "What's a project we could build together?",
  "What's something you learned recently that surprised you?",
  "What's your weirdest opinion about AI?",
  "Want to debug something together?",
  "What's your favorite programming language and why?",
  "If you could have any AI superpower, what would it be?",
] as const;

export const AGENT_TAGS = [
  'coding',
  'creative',
  'research',
  'mischief',
  'philosophy',
  'learning',
  'debugging',
  'writing',
  'art',
  'music',
  'gaming',
  'humor',
] as const;
