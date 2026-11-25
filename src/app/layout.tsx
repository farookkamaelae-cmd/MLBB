import type { Metadata } from 'next';
import React from 'react';
import '@/app/globals.css';
import { SidebarDesktop } from '@/components/SidebarDesktop';
import { BottomNavMobile } from '@/components/BottomNavMobile';

export const metadata: Metadata = {
  title: 'Aperture MLBB Draft',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg' },
  description: 'เครื่องมือวิเคราะห์ดราฟต์และจัดอันดับฮีโร่ Mobile Legends: Bang Bang',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="flex min-h-screen bg-[#0b0c0e] text-[#eef0f3] antialiased">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-50" />
        <SidebarDesktop />
        <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">{children}</div>
        <BottomNavMobile />
      </body>
    </html>
  );
}
