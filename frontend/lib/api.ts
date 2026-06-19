export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type PlayHistory = { id: number; score: number; createdAt: string };
export type RewardHistory = { id: number; checkpoint: number; rewardName: string; createdAt: string };
export type PlayerState = { score: number; plays: PlayHistory[]; rewards: RewardHistory[] };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(Array.isArray(body.message) ? body.message[0] : body.message || 'เกิดข้อผิดพลาด');
  }
  return response.json();
}
export const api = {
  state: () => request<PlayerState>('/player', { cache: 'no-store' }),
  play: () => request<{ earned: number; score: number }>('/game/play', { method: 'POST' }),
  claim: (checkpoint: number) => request<RewardHistory>(`/rewards/${checkpoint}/claim`, { method: 'POST' }),
  reset: () => request<{ score: number }>('/reset', { method: 'POST' }),
};
