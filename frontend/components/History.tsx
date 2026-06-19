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

export function History({ tab, setTab, plays, rewards }: HistoryProps) {
  const rows = tab === 'plays'
    ? plays.map((item) => ({
        id: item.id,
        title: `เล่นได้ ${item.score.toLocaleString()} คะแนน`,
        date: item.createdAt,
        color: 'play',
      }))
    : rewards.map((item) => ({
        id: item.id,
        title: `ได้รับ${item.rewardName}`,
        date: item.createdAt,
        color: 'reward',
      }));

  return (
    <section className="history-panel">
      <div className="history-tabs" role="tablist" aria-label="ประวัติ">
        <button
          role="tab"
          aria-selected={tab === 'plays'}
          onClick={() => setTab('plays')}
          className={tab === 'plays' ? 'is-active' : ''}
        >
          ประวัติการเล่น
        </button>
        <button
          role="tab"
          aria-selected={tab === 'rewards'}
          onClick={() => setTab('rewards')}
          className={tab === 'rewards' ? 'is-active' : ''}
        >
          ประวัติรางวัล
        </button>
      </div>

      {rows.length > 0 ? (
        <div className="history-list">
          {rows.map((row) => (
            <article key={row.id} className="history-row">
              <span className={`history-row__icon history-row__icon--${row.color}`} />
              <div>
                <h3>{row.title}</h3>
                <p>{tab === 'plays' ? 'เล่นเมื่อ' : 'ได้รับเมื่อ'} {formatTime(row.date)} น.</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="history-empty">
          <span>{tab === 'plays' ? '●' : '◆'}</span>
          <p>ยังไม่มี{tab === 'plays' ? 'ประวัติการเล่น' : 'รางวัลที่ได้รับ'}</p>
        </div>
      )}
    </section>
  );
}
