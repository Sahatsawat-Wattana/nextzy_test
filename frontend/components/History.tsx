'use client';
import type { PlayHistory, RewardHistory } from '@/lib/api';

function time(value: string) { return new Intl.DateTimeFormat('th-TH', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); }
export function History({ tab, setTab, plays, rewards }: { tab: 'plays' | 'rewards'; setTab: (tab: 'plays' | 'rewards') => void; plays: PlayHistory[]; rewards: RewardHistory[] }) {
  const rows = tab === 'plays' ? plays.map(x => ({ id: x.id, title: `เล่นได้ ${x.score.toLocaleString()} คะแนน`, date: x.createdAt, color: 'bg-rose-500' })) : rewards.map(x => ({ id: x.id, title: `ได้รับ${x.rewardName}`, date: x.createdAt, color: 'bg-violet-600' }));
  return <section className="px-5 pb-28 pt-5">
    <div className="flex gap-2 border-b border-slate-100 pb-3"><button onClick={() => setTab('plays')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'plays' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>ประวัติการเล่น</button><button onClick={() => setTab('rewards')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'rewards' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>ประวัติรางวัล</button></div>
    {rows.length ? <div className="divide-y divide-slate-100">{rows.map(row => <article key={row.id} className="flex items-center gap-4 py-4"><div className={`h-11 w-11 shrink-0 rounded-full ${row.color}`} /><div><h3 className="font-bold">{row.title}</h3><p className="mt-1 text-xs text-slate-400">{time(row.date)}</p></div></article>)}</div> : <div className="py-16 text-center"><div className="text-4xl">🕹️</div><p className="mt-3 text-sm text-slate-400">ยังไม่มี{tab === 'plays' ? 'ประวัติการเล่น' : 'รางวัลที่ได้รับ'}</p></div>}
  </section>;
}
