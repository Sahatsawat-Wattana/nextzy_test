'use client';

import type { PlayHistory, RewardHistory } from '@/lib/api';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

type HistoryProps = {
  tab: 'plays' | 'rewards';
  setTab: (tab: 'plays' | 'rewards') => void;
  plays: PlayHistory[];
  rewards: RewardHistory[];
};

const TAB_BASE_CLASSES = 'rounded-full border bg-white px-[11px] py-[5px] text-[11px] leading-none';

export function History({ tab, setTab, plays, rewards }: HistoryProps) {
  const rows =
    tab === 'plays'
      ? plays.map((item) => ({
          id: item.id,
          title: `เล่นได้ ${item.score.toLocaleString()} คะแนน`,
          date: item.createdAt,
          iconClasses: 'bg-gradient-to-br from-[#d90d28] to-[#ff3840]',
        }))
      : rewards.map((item) => ({
          id: item.id,
          title: `ได้รับ${item.rewardName}`,
          date: item.createdAt,
          iconClasses: 'bg-gradient-to-br from-[#170096] to-[#7900ff]',
        }));

  return (
    <section className="bg-white">
      <div
        className="flex min-h-12 items-center gap-2 border-b border-[#ececec] px-[11px]"
        role="tablist"
        aria-label="ประวัติ"
      >
        <button
          role="tab"
          aria-selected={tab === 'plays'}
          onClick={() => setTab('plays')}
          className={`${TAB_BASE_CLASSES} ${tab === 'plays' ? 'border-[#ff3540] text-[#ff3540]' : 'border-[#c9c9c9] text-[#aaa]'}`}
        >
          ประวัติการเล่น
        </button>
        <button
          role="tab"
          aria-selected={tab === 'rewards'}
          onClick={() => setTab('rewards')}
          className={`${TAB_BASE_CLASSES} ${tab === 'rewards' ? 'border-[#ff3540] text-[#ff3540]' : 'border-[#c9c9c9] text-[#aaa]'}`}
        >
          ประวัติรางวัล
        </button>
      </div>

      {rows.length > 0 ? (
        <div className="bg-white">
          {rows.map((row) => (
            <article
              key={row.id}
              className="flex min-h-[76px] items-center gap-[17px] border-b border-[#ededed] px-[23px] py-[11px] max-[340px]:gap-3 max-[340px]:px-[15px] min-[420px]:px-[29px]"
            >
              <span
                className={`h-[47px] w-[47px] flex-none rounded-full max-[340px]:h-10 max-[340px]:w-10 ${row.iconClasses}`}
              />
              <div>
                <h3 className="m-0 text-sm font-extrabold max-[340px]:text-xs">{row.title}</h3>
                <p className="mb-0 mt-[5px] text-[10px] text-[#b0b0b0]">
                  {tab === 'plays' ? 'เล่นเมื่อ' : 'ได้รับเมื่อ'} {formatTime(row.date)} น.
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[180px] place-content-center text-center text-[#b8b8b8]">
          <span className="text-[30px] text-[#ef233c]">{tab === 'plays' ? '●' : '◆'}</span>
          <p className="mb-0 mt-2 text-xs">
            ยังไม่มี{tab === 'plays' ? 'ประวัติการเล่น' : 'รางวัลที่ได้รับ'}
          </p>
        </div>
      )}
    </section>
  );
}
