'use client';

export function Modal({ title, detail, icon = '🏆', onClose }: { title: string; detail: string; icon?: string; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-6" role="dialog" aria-modal="true">
    <div className="animate-pop relative w-full max-w-xs rounded-3xl bg-white px-7 pb-7 pt-8 text-center shadow-2xl">
      <button aria-label="ปิด" onClick={onClose} className="absolute right-5 top-4 text-2xl text-slate-400">×</button>
      <div className="mb-4 text-5xl" aria-hidden="true">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
      <button onClick={onClose} className="mt-6 w-full rounded-full bg-amber-400 py-3 font-bold text-white transition hover:bg-amber-500">ปิด</button>
    </div>
  </div>;
}
