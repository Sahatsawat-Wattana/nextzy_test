import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nextzy Rewards',
  description: 'เกมสะสมคะแนนเพื่อรับรางวัล',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="m-0 bg-[#f2f2f2] font-sans text-[#171717]">{children}</body>
    </html>
  );
}
