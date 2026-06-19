'use client';

import { MAX_SCORE, REWARD_CHECKPOINTS, scorePercentage } from '@/lib/game';

type ScoreCardProps = {
  score: number;
  claimed: number[];
  onClaim: (value: number, name: string) => void;
  busy: boolean;
};

const ACTION_STATE_CLASSES = {
  claimed: 'border-[#ff5964] bg-white text-[#ff5964]',
  unlocked: 'border-[#ff2631] bg-[#ff2631] text-white',
  locked: 'border-[#d2d2d2] bg-[#d2d2d2] text-[#aaa]',
};

export function ScoreCard({ score, claimed, onClaim, busy }: ScoreCardProps) {
  const percent = scorePercentage(score);
  const claimedCheckpoints = new Set(claimed);

  return (
    <section
      className="min-h-[205px] overflow-hidden rounded-[15px] border-[1.5px] border-[#262626] bg-white px-[14px] pb-3 pt-[14px] max-[340px]:min-h-[188px] max-[340px]:px-[10px] max-[340px]:pb-[10px] max-[340px]:pt-[11px] min-[420px]:min-h-[218px] min-[420px]:px-[18px] min-[420px]:pb-[14px] min-[420px]:pt-4"
      aria-label="คะแนนสะสมและระดับรางวัล"
    >
      <div className="grid min-h-[46px] grid-cols-[1fr_auto_1fr] items-start max-[340px]:min-h-[42px]">
        <span className="justify-self-start rounded-full bg-[#c92d3d] px-3 py-[5px] text-[10px] font-bold text-white max-[340px]:px-2 max-[340px]:py-1 max-[340px]:text-[8px]">
          หน้าหลัก
        </span>
        <span className="text-[8px] tracking-[.15em] text-[#e5e5e5]">NEXTZY</span>
        <div className="justify-self-end text-right">
          <p className="m-0 text-[13px] font-extrabold max-[340px]:text-[11px]">สะสมคะแนน</p>
          <span className="mt-[5px] block whitespace-nowrap text-[9px] font-bold max-[340px]:text-[7px]">
            คะแนนครบ 10,000 รับรางวัลใหญ่
          </span>
        </div>
      </div>

      <p className="mb-[17px] mt-[-1px] text-right text-2xl font-black leading-none tracking-[-.04em] text-[#ff1f2d] max-[340px]:mb-[15px] max-[340px]:text-xl min-[420px]:text-[26px]">
        {score.toLocaleString()}/{MAX_SCORE.toLocaleString()}
      </p>

      <div className="px-[5px]">
        <div className="mb-[7px] ml-[42%] grid grid-cols-3 text-center text-[8px] text-[#979797]">
          {REWARD_CHECKPOINTS.map(({ value }) => (
            <span key={value}>{value.toLocaleString()}</span>
          ))}
        </div>

        <div className="relative h-[7px] rounded-full bg-[#d9d9d9]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff8a57] to-[#ff252f] transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
          <span className="absolute left-0 top-1/2 h-[9px] w-[9px] -translate-y-1/2 -translate-x-px rounded-full bg-[#ff835e]" />
          {REWARD_CHECKPOINTS.map(({ value }) => {
            const isClaimed = claimedCheckpoints.has(value);
            const isFinal = value === MAX_SCORE;
            const markerClasses = isFinal
              ? 'h-7 w-7 border-[#ffb000] bg-[#ffd34c] text-[13px] text-[#f89b00]'
              : `h-[21px] w-[21px] border-white text-[9px] text-white ${isClaimed ? 'bg-[#009e3b]' : 'bg-[#a5a5a5]'}`;

            return (
              <span
                key={value}
                className={`absolute top-1/2 z-[2] grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] font-black ${markerClasses}`}
                style={{ left: `${scorePercentage(value)}%` }}
              >
                {isFinal && !isClaimed ? '♛' : '✓'}
              </span>
            );
          })}
          {percent < 100 && (
            <span
              className="absolute top-1/2 z-[3] h-[17px] w-[17px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#ff1f2d]"
              style={{ left: `${percent}%` }}
            />
          )}
        </div>

        <div className="ml-[42%] mt-[15px] grid grid-cols-3 gap-2 max-[340px]:gap-1">
          {REWARD_CHECKPOINTS.map(({ value, name }) => {
            const isClaimed = claimedCheckpoints.has(value);
            const unlocked = score >= value;
            const state = isClaimed ? 'claimed' : unlocked ? 'unlocked' : 'locked';
            const label = isClaimed ? 'ได้รับแล้ว' : unlocked ? 'กดรับรางวัล' : 'ยังไม่ได้รับ';

            return (
              <button
                key={value}
                disabled={!unlocked || isClaimed || busy}
                onClick={() => onClaim(value, name)}
                className={`min-w-0 whitespace-nowrap rounded-full border px-[3px] py-1 text-[7px] font-bold opacity-100 max-[340px]:text-[6px] ${ACTION_STATE_CLASSES[state]}`}
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
