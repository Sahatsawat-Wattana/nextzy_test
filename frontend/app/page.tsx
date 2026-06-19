'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { History } from '@/components/History';
import { Modal, type ModalContent } from '@/components/Modal';
import { ScoreCard } from '@/components/ScoreCard';
import { getErrorMessage } from '@/lib/errors';
import { hasReachedMaxScore, MAX_SCORE } from '@/lib/game';
import { api, type PlayerState } from '@/lib/api';

const MAX_SCORE_DIALOG: ModalContent = {
  title: 'คะแนนเต็มแล้ว',
  detail: `คะแนนสะสมครบ ${MAX_SCORE.toLocaleString()} คะแนน กรุณารับรางวัลหรือ Reset เพื่อเริ่มใหม่`,
  icon: '✓',
};

export default function Home() {
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [tab, setTab] = useState<'plays' | 'rewards'>('plays');
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState<ModalContent | null>(null);

  const loadPlayer = useCallback(async () => {
    const state = await api.state();
    setPlayer(state);
  }, []);

  useEffect(() => {
    void loadPlayer().catch((error) => {
      setDialog({
        title: 'เชื่อมต่อไม่สำเร็จ',
        detail: getErrorMessage(error),
        icon: '!',
      });
    });
  }, [loadPlayer]);

  async function claimReward(checkpoint: number, name: string) {
    setBusy(true);
    try {
      await api.claim(checkpoint);
      await loadPlayer();
      setDialog({ title: 'ยินดีด้วย', detail: `คุณได้รับ${name}` });
    } catch (error) {
      setDialog({
        title: 'ไม่สามารถทำรายการได้',
        detail: getErrorMessage(error),
        icon: '!',
      });
    } finally {
      setBusy(false);
    }
  }

  async function resetPlayer() {
    if (!window.confirm('รีเซตคะแนนและประวัติทั้งหมดหรือไม่?')) return;

    setBusy(true);
    try {
      await api.reset();
      await loadPlayer();
      setTab('plays');
    } catch (error) {
      setDialog({
        title: 'ไม่สามารถทำรายการได้',
        detail: getErrorMessage(error),
        icon: '!',
      });
    } finally {
      setBusy(false);
    }
  }

  const isMaxScore = player ? hasReachedMaxScore(player.score) : false;

  return (
    <main className="app-shell home-page">
      {player ? (
        <>
          <div className="home-hero">
            <ScoreCard
              score={player.score}
              claimed={player.rewards.map(({ checkpoint }) => checkpoint)}
              onClaim={claimReward}
              busy={busy}
            />
          </div>
          <div className="reset-panel">
            <button disabled={busy} onClick={resetPlayer}>
              RESET
            </button>
          </div>
          <History tab={tab} setTab={setTab} plays={player.plays} rewards={player.rewards} />
        </>
      ) : (
        <div className="home-loading">กำลังโหลด...</div>
      )}

      <div className="home-action safe-bottom">
        {isMaxScore ? (
          <button type="button" className="is-max" onClick={() => setDialog(MAX_SCORE_DIALOG)}>
            คะแนนเต็มแล้ว
          </button>
        ) : (
          <Link href="/game">ไปเล่นเกม</Link>
        )}
      </div>

      {dialog && <Modal {...dialog} onClose={() => setDialog(null)} />}
    </main>
  );
}
