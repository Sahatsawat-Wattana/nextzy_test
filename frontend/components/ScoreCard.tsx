'use client';

const checkpoints = [{ value: 5000, name: 'รางวัล A' }, { value: 7500, name: 'รางวัล B' }, { value: 10000, name: 'รางวัล C' }];

export function ScoreCard({ score, claimed, onClaim, busy }: { score: number; claimed: number[]; onClaim: (value: number, name: string) => void; busy: boolean }) {
  const percent = Math.min(100, score / 100);
  return <section className="rounded-b-[2.25rem] bg-slate-900 px-5 pb-7 pt-5 text-white shadow-xl">
    <div className="flex items-center justify-between"><span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold">Nextzy Rewards</span><span className="text-xs text-slate-400">คะแนนสูงสุด 10,000</span></div>
    <div className="mt-5 text-center"><p className="text-sm text-slate-300">คะแนนสะสม</p><p className="mt-1 text-4xl font-black tracking-tight text-rose-400">{score.toLocaleString()}<span className="text-lg text-white">/10,000</span></p></div>
    <div className="relative mt-8 h-2 rounded-full bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-500" style={{ width: `${percent}%` }} /></div>
    <div className="mt-2 grid grid-cols-3 gap-2">
      {checkpoints.map(({ value, name }) => { const isClaimed = claimed.includes(value); const unlocked = score >= value; return <div key={value} className="text-center">
        <div className={`mx-auto -mt-5 grid h-7 w-7 place-items-center rounded-full border-4 border-slate-900 text-xs ${isClaimed ? 'bg-emerald-500' : unlocked ? 'bg-amber-400' : 'bg-slate-600'}`}>{isClaimed ? '✓' : unlocked ? '★' : '•'}</div>
        <p className="mt-1 text-[11px] text-slate-400">{value.toLocaleString()}</p>
        <button disabled={!unlocked || isClaimed || busy} onClick={() => onClaim(value, name)} className={`mt-2 rounded-full px-2 py-1 text-[10px] font-bold ${isClaimed ? 'bg-slate-700 text-slate-400' : unlocked ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{isClaimed ? 'รับแล้ว' : 'รับรางวัล'}</button>
      </div>; })}
    </div>
  </section>;
}
