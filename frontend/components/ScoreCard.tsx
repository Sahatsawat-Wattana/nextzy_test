'use client';

import { MAX_SCORE, REWARD_CHECKPOINTS, scorePercentage } from '@/lib/game';

type ScoreCardProps = {
  score: number;
  claimed: number[];
  onClaim: (value: number, name: string) => void;
  busy: boolean;
};

export function ScoreCard({ score, claimed, onClaim, busy }: ScoreCardProps) {
  const percent = scorePercentage(score);
  const claimedCheckpoints = new Set(claimed);

  return (
    <section className="score-card" aria-label="คะแนนสะสมและระดับรางวัล">
      <div className="score-card__header">
        <span className="score-card__badge">หน้าหลัก</span>
        <span className="score-card__brand">NEXTZY</span>
        <div className="score-card__summary">
          <p>สะสมคะแนน</p>
          <span>คะแนนครบ 10,000 รับรางวัลใหญ่</span>
        </div>
      </div>

      <p className="score-card__total">
        {score.toLocaleString()}/{MAX_SCORE.toLocaleString()}
      </p>

      <div className="reward-progress">
        <div className="reward-progress__labels">
          {REWARD_CHECKPOINTS.map(({ value }) => (
            <span key={value}>{value.toLocaleString()}</span>
          ))}
        </div>

        <div className="reward-progress__track">
          <div className="reward-progress__fill" style={{ width: `${percent}%` }} />
          <span className="reward-progress__start" />
          {REWARD_CHECKPOINTS.map(({ value }) => {
            const isClaimed = claimedCheckpoints.has(value);
            const unlocked = score >= value;
            const stateClass = isClaimed ? 'is-claimed' : unlocked ? 'is-unlocked' : 'is-locked';
            return (
              <span
                key={value}
                className={`reward-progress__checkpoint ${value === MAX_SCORE ? 'is-final' : ''} ${stateClass}`}
                style={{ left: `${scorePercentage(value)}%` }}
              >
                {value === MAX_SCORE && !isClaimed ? '♛' : '✓'}
              </span>
            );
          })}
          {percent < 100 && (
            <span className="reward-progress__current" style={{ left: `${percent}%` }} />
          )}
        </div>

        <div className="reward-actions">
          {REWARD_CHECKPOINTS.map(({ value, name }) => {
            const isClaimed = claimedCheckpoints.has(value);
            const unlocked = score >= value;
            const stateClass = isClaimed ? 'is-claimed' : unlocked ? 'is-unlocked' : 'is-locked';
            const label = isClaimed ? 'ได้รับแล้ว' : unlocked ? 'กดรับรางวัล' : 'ยังไม่ได้รับ';
            return (
              <button
                key={value}
                disabled={!unlocked || isClaimed || busy}
                onClick={() => onClaim(value, name)}
                className={stateClass}
                aria-label={`${name} ที่ ${value.toLocaleString()} คะแนน`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
