'use client';

export type ModalContent = {
  title: string;
  detail: string;
  icon?: string | null;
};

type ModalProps = ModalContent & {
  onClose: () => void;
};

export function Modal({ title, detail, icon = '♛', onClose }: ModalProps) {
  const coinClasses =
    icon === '♛'
      ? 'rounded-full border-[5px] border-[#ffad00] bg-[#ffd037] text-[#f58b00] shadow-[inset_0_0_0_2px_#ffe170]'
      : '';

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgb(236_236_236_/_0.82)] p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="relative w-full max-w-[330px] animate-pop rounded-[17px] bg-white px-7 pb-6 pt-7 text-center shadow-[0_12px_40px_rgb(0_0_0_/_0.08)] min-[420px]:max-w-[360px]">
        <button
          aria-label="ปิด"
          onClick={onClose}
          className="absolute right-[13px] top-2 border-0 bg-transparent text-[26px] font-light text-[#999]"
        >
          ×
        </button>
        {icon && (
          <div
            className={`mx-auto mb-4 grid h-14 w-14 place-items-center text-[30px] font-black ${coinClasses}`}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h2 className="m-0 text-[17px] font-extrabold">{title}</h2>
        <p className="mb-0 mt-[11px] text-[11px] text-[#555]">{detail}</p>
        <button
          onClick={onClose}
          className="mt-6 w-[58%] rounded-full border-0 bg-[#ffb915] p-[7px] text-[11px] font-extrabold text-white"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
