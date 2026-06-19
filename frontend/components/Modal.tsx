'use client';

export type ModalContent = {
  title: string;
  detail: string;
  icon?: string;
};

type ModalProps = ModalContent & {
  onClose: () => void;
};

export function Modal({ title, detail, icon = '♛', onClose }: ModalProps) {
  const isReward = icon === '♛';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="reward-modal animate-pop">
        <button aria-label="ปิด" onClick={onClose} className="reward-modal__close">
          ×
        </button>
        <div className={`reward-modal__icon ${isReward ? 'is-coin' : ''}`} aria-hidden="true">
          {icon}
        </div>
        <h2>{title}</h2>
        <p>{detail}</p>
        <button onClick={onClose} className="reward-modal__button">
          ปิด
        </button>
      </div>
    </div>
  );
}
