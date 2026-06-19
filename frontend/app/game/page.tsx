'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/Modal';
import { api } from '@/lib/api';

const scores = [300, 500, 1000, 3000];
export default function GamePage() {
  const [total, setTotal] = useState(0); const [visible, setVisible] = useState(scores); const [playing, setPlaying] = useState(false); const [result, setResult] = useState<number | null>(null); const [error, setError] = useState<string | null>(null);
  useEffect(() => { api.state().then(x => setTotal(x.score)).catch(e => setError(e.message)); }, []);
  async function play() {
    if (playing) return; setPlaying(true); setVisible(scores); setResult(null);
    try {
      const response = await api.play(); const losers = scores.filter(x => x !== response.earned);
      for (const loser of losers.sort(() => Math.random() - .5)) { await new Promise(r => setTimeout(r, 450)); setVisible(current => current.filter(x => x !== loser)); }
      await new Promise(r => setTimeout(r, 350)); setTotal(response.score); setResult(response.earned);
    } catch (e) { setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด'); } finally { setPlaying(false); }
  }
  function closeResult() { setResult(null); setVisible(scores); }
  return <main className="app-shell gradient-page flex min-h-dvh flex-col px-5">
    <header className="pt-8 text-center"><p className="text-sm font-bold text-slate-500">คะแนนสะสม</p><h1 className="mt-1 text-2xl font-black">{total.toLocaleString()}<span className="text-slate-400">/10,000</span></h1></header>
    <section className="flex flex-1 flex-col items-center justify-center pb-24"><div className="grid w-full grid-cols-4 gap-2">{scores.map(score => <div key={score} className={`rounded-xl py-3 text-center text-sm font-black transition-all duration-300 ${visible.includes(score) ? 'scale-100 bg-teal-400 text-slate-900 opacity-100 shadow-md' : 'scale-75 bg-transparent text-emerald-600 opacity-20'}`}>{score.toLocaleString()}</div>)}</div><button onClick={play} disabled={playing} className="mt-12 rounded-full bg-rose-500 px-8 py-3 font-bold text-white shadow-lg disabled:bg-rose-300">{playing ? 'กำลังสุ่ม...' : 'สุ่มคะแนน'}</button></section>
    <div className="safe-bottom sticky bottom-0 -mx-5 rounded-t-3xl border-t bg-white px-5 pt-3"><Link href="/" className="block rounded-full bg-amber-400 py-3 text-center font-bold text-white">กลับหน้าหลัก</Link></div>
    {result !== null && <Modal title="ได้รับ" detail={`${result.toLocaleString()} คะแนน`} icon="🎉" onClose={closeResult} />}{error && <Modal title="เชื่อมต่อไม่สำเร็จ" detail={error} icon="!" onClose={() => setError(null)} />}
  </main>;
}
