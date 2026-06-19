'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Modal, type ModalContent } from '@/components/Modal';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { hasReachedMaxScore, MAX_SCORE, SCORE_OPTIONS } from '@/lib/game';

const ANIMATION_DELAY_MS = 450;
const RESULT_DELAY_MS = 350;

const MAX_SCORE_DIALOG: ModalContent = {
  title: 'คะแนนเต็มแล้ว',
  detail: 'ไม่สามารถสุ่มคะแนนเพิ่มได้ กรุณากลับไปรับรางวัลหรือ Reset เพื่อเริ่มใหม่',
  icon: '✓',
};

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GamePage() {
  const [totalScore, setTotalScore] = useState(0);
  const [visibleScores, setVisibleScores] = useState<readonly number[]>(SCORE_OPTIONS);
  const [playing, setPlaying] = useState(false);
  const [dialog, setDialog] = useState<ModalContent | null>(null);
  const isMaxScore = hasReachedMaxScore(totalScore);

  useEffect(() => {
    api
      .state()
      .then(({ score }) => setTotalScore(score))
      .catch((error) =>
        setDialog({
          title: 'เชื่อมต่อไม่สำเร็จ',
          detail: getErrorMessage(error),
          icon: '!',
        }),
      );
  }, []);

  async function play() {
    if (playing) return;
    if (isMaxScore) {
      setDialog(MAX_SCORE_DIALOG);
      return;
    }

    setPlaying(true);
    setVisibleScores(SCORE_OPTIONS);

    try {
      const result = await api.play();
      const eliminatedScores = SCORE_OPTIONS.filter((score) => score !== result.earned).sort(
        () => Math.random() - 0.5,
      );

      for (const eliminatedScore of eliminatedScores) {
        await delay(ANIMATION_DELAY_MS);
        setVisibleScores((scores) => scores.filter((score) => score !== eliminatedScore));
      }

      await delay(RESULT_DELAY_MS);
      setTotalScore(result.score);

      const reachedMax = hasReachedMaxScore(result.score);
      setDialog({
        title: reachedMax ? 'คะแนนเต็มแล้ว' : 'ได้รับ',
        detail: reachedMax
          ? `ได้รับ ${result.earned.toLocaleString()} คะแนน และสะสมครบ ${MAX_SCORE.toLocaleString()} คะแนนแล้ว`
          : `${result.earned.toLocaleString()} คะแนน`,
        icon: reachedMax ? '✓' : null,
      });
    } catch (error) {
      setDialog({
        title: 'เชื่อมต่อไม่สำเร็จ',
        detail: getErrorMessage(error),
        icon: '!',
      });
    } finally {
      setPlaying(false);
    }
  }

  function closeDialog() {
    setDialog(null);
    setVisibleScores(SCORE_OPTIONS);
  }

  return (
    <main className="app-shell game-page">
      <header className="game-header">
        <h1>
          คะแนนสะสม {totalScore.toLocaleString()}/{MAX_SCORE.toLocaleString()}
        </h1>
        {isMaxScore && <strong>คะแนนเต็มแล้ว</strong>}
      </header>

      <section className="game-stage">
        <div className="game-options">
          {SCORE_OPTIONS.map((score) => (
            <div key={score} className={visibleScores.includes(score) ? 'is-visible' : 'is-hidden'}>
              {score.toLocaleString()}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={play}
          disabled={playing}
          className={`game-play-button ${isMaxScore ? 'is-max' : ''}`}
        >
          {playing ? 'กำลังสุ่ม...' : isMaxScore ? 'คะแนนเต็มแล้ว' : 'สุ่มคะแนน'}
        </button>
      </section>

      <div className="game-footer safe-bottom">
        <Link href="/">กลับหน้าหลัก</Link>
      </div>

      {dialog && <Modal {...dialog} onClose={closeDialog} />}
    </main>
  );
}
