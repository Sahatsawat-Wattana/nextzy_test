'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { History } from '@/components/History';
import { Modal } from '@/components/Modal';
import { ScoreCard } from '@/components/ScoreCard';
import { api, type PlayerState } from '@/lib/api';

export default function Home() {
  const [state, setState] = useState<PlayerState | null>(null);
  const [tab, setTab] = useState<'plays' | 'rewards'>('plays');
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api.state().then(setState).catch((err) => setError(err.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function claim(checkpoint: number, name: string) {
    setBusy(true);
    try {
      await api.claim(checkpoint);
      await load();
      setModal(name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!window.confirm('รีเซตคะแนนและประวัติทั้งหมดหรือไม่?')) return;
    setBusy(true);
    try {
      await api.reset();
      await load();
      setTab('plays');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-shell home-page">
      {state ? (
        <>
          <div className="home-hero">
            <ScoreCard
              score={state.score}
              claimed={state.rewards.map((item) => item.checkpoint)}
              onClaim={claim}
              busy={busy}
            />
          </div>
          <div className="reset-panel">
            <button disabled={busy} onClick={reset}>RESET</button>
          </div>
          <History tab={tab} setTab={setTab} plays={state.plays} rewards={state.rewards} />
        </>
      ) : (
        <div className="home-loading">กำลังโหลด...</div>
      )}

      <div className="home-action safe-bottom">
        <Link href="/game">ไปเล่นเกม</Link>
      </div>

      {modal && (
        <Modal title="ยินดีด้วย" detail={`คุณได้รับ${modal}`} onClose={() => setModal(null)} />
      )}
      {error && (
        <Modal title="ไม่สามารถทำรายการได้" detail={error} icon="!" onClose={() => setError(null)} />
      )}
    </main>
  );
}
