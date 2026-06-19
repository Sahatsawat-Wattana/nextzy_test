'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Modal, type ModalContent } from '@/components/Modal';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { hasReachedMaxScore, MAX_SCORE, SCORE_OPTIONS } from '@/lib/game';
import { APP_SHELL_CLASSES, PRIMARY_ACTION_CLASSES } from '@/lib/styles';

const ANIMATION_DELAY_MS = 450;
const RESULT_DELAY_MS = 350;
const FINISH_HOLD_MS = 500;

type GamePhase = 'idle' | 'playing' | 'finished';

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
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [dialog, setDialog] = useState<ModalContent | null>(null);
  const isMaxScore = hasReachedMaxScore(totalScore);
  const roundActive = phase !== 'idle';

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
    if (roundActive) return;
    if (isMaxScore) {
      setDialog(MAX_SCORE_DIALOG);
      return;
    }

    setPhase('playing');
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
      setPhase('finished');
      await delay(FINISH_HOLD_MS);

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
      setPhase('idle');
    }
  }

  function closeDialog() {
    setDialog(null);
    setVisibleScores(SCORE_OPTIONS);
    setPhase('idle');
  }

  return (
    <main
      className={`${APP_SHELL_CLASSES} flex flex-col bg-gradient-to-b from-[#fffdfb] via-[#fff7ed] to-[#ffead1] px-[clamp(7px,2.5vw,14px)]`}
    >
      <header className="pt-[clamp(30px,9vw,46px)] text-center">
        <h1 className="m-0 text-[clamp(13px,3.7vw,17px)] font-black leading-none text-[#172033]">
          คะแนนสะสม {totalScore.toLocaleString()}/{MAX_SCORE.toLocaleString()}
        </h1>
        {isMaxScore && (
          <strong className="mt-[10px] inline-block rounded-full bg-[#fff0f1] px-[13px] py-[6px] text-[clamp(10px,3vw,12px)] text-[#e62835]">
            คะแนนเต็มแล้ว
          </strong>
        )}
      </header>

      <section className="flex flex-1 flex-col items-center justify-start pt-[clamp(105px,22dvh,150px)]">
        <div className="grid w-full grid-cols-4 gap-[clamp(5px,1.8vw,9px)]">
          {SCORE_OPTIONS.map((score) => {
            const visible = visibleScores.includes(score);
            const winner = phase === 'finished' && visible;
            const stateClasses = winner
              ? 'scale-100 bg-[#22c55e] text-white opacity-100'
              : visible
                ? 'scale-100 bg-[#20d5b4] text-[#172033] opacity-100'
                : 'scale-100 bg-transparent text-[#42ad73] opacity-70';

            return (
              <div
                key={score}
                className={`rounded-[clamp(7px,2.2vw,11px)] px-0.5 py-[clamp(7px,2.5vw,11px)] text-center text-[clamp(11px,3.5vw,15px)] font-black transition-all duration-300 ${stateClasses}`}
              >
                {score.toLocaleString()}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={play}
          disabled={roundActive}
          className={`mt-[clamp(35px,10vw,48px)] w-[clamp(96px,31vw,138px)] rounded-[clamp(7px,2.2vw,10px)] border-0 px-1 py-[clamp(8px,2.5vw,11px)] text-[clamp(11px,3.2vw,14px)] font-extrabold text-white disabled:bg-[#ffaaa8] ${isMaxScore ? 'bg-[#a8a8a8]' : 'bg-[#ff2933]'}`}
        >
          {roundActive ? 'กำลังสุ่ม...' : isMaxScore ? 'คะแนนเต็มแล้ว' : 'สุ่มคะแนน'}
        </button>
      </section>

      <div className="safe-bottom sticky bottom-0 [margin-inline:clamp(-14px,-2.5vw,-7px)] rounded-t-[18px] border-t border-[#e5e5e5] bg-white px-[clamp(10px,3vw,17px)] pb-[10px] pt-[13px]">
        <Link
          href="/"
          className={`${PRIMARY_ACTION_CLASSES} p-[clamp(12px,3.5vw,15px)] text-[clamp(13px,4vw,16px)]`}
        >
          กลับหน้าหลัก
        </Link>
      </div>

      {dialog && <Modal {...dialog} onClose={closeDialog} />}
    </main>
  );
}
