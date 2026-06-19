const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type PlayHistory = {
  id: number;
  score: number;
  createdAt: string;
};

export type RewardHistory = {
  id: number;
  checkpoint: number;
  rewardName: string;
  createdAt: string;
};

export type PlayerState = {
  score: number;
  plays: PlayHistory[];
  rewards: RewardHistory[];
};

type ApiErrorResponse = {
  message?: string | string[];
};

function firstMessage(message: ApiErrorResponse['message']) {
  return Array.isArray(message) ? message[0] : message;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}) as ApiErrorResponse);
    throw new Error(firstMessage(error.message) ?? 'เกิดข้อผิดพลาด');
  }

  return response.json();
}

export const api = {
  state: () => request<PlayerState>('/player', { cache: 'no-store' }),
  play: () => request<{ earned: number; score: number }>('/game/play', { method: 'POST' }),
  claim: (checkpoint: number) =>
    request<RewardHistory>(`/rewards/${checkpoint}/claim`, { method: 'POST' }),
  reset: () => request<{ score: number }>('/reset', { method: 'POST' }),
};
