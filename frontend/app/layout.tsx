import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Nextzy Rewards', description: 'เกมสะสมคะแนนเพื่อรับรางวัล' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
