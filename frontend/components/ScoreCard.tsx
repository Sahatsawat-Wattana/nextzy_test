'use client';

const checkpoints = [
  { value: 5000, name: 'รางวัล A' },
  { value: 7500, name: 'รางวัล B' },
  { value: 10000, name: 'รางวัล C' },
];

type ScoreCardProps = {
  score: number;
  claimed: number[];
  onClaim: (value: number, name: string) => void;
  busy: boolean;
};

export function ScoreCard({ score, claimed, onClaim, busy }: ScoreCardProps) {
  const percent = Math.min(100, score / 100);

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
        {score.toLocaleString()}/10,000
      </p>

      <div className="reward-progress">
        <div className="reward-progress__labels">
          {checkpoints.map(({ value }) => (
            <span key={value}>{value.toLocaleString()}</span>
          ))}
        </div>

        <div className="reward-progress__track">
          <div className="reward-progress__fill" style={{ width: `${percent}%` }} />
          <span className="reward-progress__start" />
          {checkpoints.map(({ value }) => {
            const isClaimed = claimed.includes(value);
            const unlocked = score >= value;
            return (
              <span
                key={value}
                className={`reward-progress__checkpoint ${value === 10000 ? 'is-final' : ''} ${isClaimed ? 'is-claimed' : unlocked ? 'is-unlocked' : 'is-locked'}`}
                style={{ left: `${value / 100}%` }}
              >
                {isClaimed ? '✓' : value === 10000 ? '♛' : '✓'}
              </span>
            );
          })}
          {percent < 100 && (
            <span className="reward-progress__current" style={{ left: `${percent}%` }} />
          )}
        </div>

        <div className="reward-actions">
          {checkpoints.map(({ value, name }) => {
            const isClaimed = claimed.includes(value);
            const unlocked = score >= value;
            return (
              <button
                key={value}
                disabled={!unlocked || isClaimed || busy}
                onClick={() => onClaim(value, name)}
                className={isClaimed ? 'is-claimed' : unlocked ? 'is-unlocked' : 'is-locked'}
                aria-label={`${name} ที่ ${value.toLocaleString()} คะแนน`}
              >
                {isClaimed ? 'ได้รับแล้ว' : unlocked ? 'กดรับรางวัล' : 'ยังไม่ได้รับ'}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
