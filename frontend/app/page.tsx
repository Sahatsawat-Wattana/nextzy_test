'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { History } from '@/components/History';
import { Modal } from '@/components/Modal';
import { ScoreCard } from '@/components/ScoreCard';
import { api, type PlayerState } from '@/lib/api';

export default function Home() {
  const [state, setState] = useState<PlayerState | null>(null); const [tab, setTab] = useState<'plays' | 'rewards'>('plays'); const [busy, setBusy] = useState(false); const [modal, setModal] = useState<string | null>(null); const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => api.state().then(setState).catch(e => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);
  async function claim(checkpoint: number, name: string) { setBusy(true); try { await api.claim(checkpoint); await load(); setModal(name); } catch (e) { setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด'); } finally { setBusy(false); } }
  async function reset() { if (!window.confirm('รีเซตคะแนนและประวัติทั้งหมดหรือไม่?')) return; setBusy(true); try { await api.reset(); await load(); setTab('plays'); } catch (e) { setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด'); } finally { setBusy(false); } }
  return <main className="app-shell min-h-dvh">
    {state ? <><ScoreCard score={state.score} claimed={state.rewards.map(x => x.checkpoint)} onClaim={claim} busy={busy} /><div className="flex justify-center pt-5"><button disabled={busy} onClick={reset} className="rounded-full border border-indigo-600 px-5 py-2 text-xs font-black text-indigo-600">RESET</button></div><History tab={tab} setTab={setTab} plays={state.plays} rewards={state.rewards} /></> : <div className="grid min-h-dvh place-items-center text-sm text-slate-400">กำลังโหลด...</div>}
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t bg-white/95 px-5 pt-3 backdrop-blur"><Link href="/game" className="block rounded-full bg-amber-400 py-3 text-center font-bold text-white shadow-lg transition hover:bg-amber-500">ไปเล่นเกม</Link></div>
    {modal && <Modal title="ยินดีด้วย" detail={`คุณได้รับ${modal}`} onClose={() => setModal(null)} />}{error && <Modal title="ไม่สามารถทำรายการได้" detail={error} icon="!" onClose={() => setError(null)} />}
  </main>;
}
