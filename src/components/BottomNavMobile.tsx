'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNavMobile: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'หน้าแรก', href: '/', icon: '🏠' },
    { name: 'Tier List', href: '/tier-list', icon: '🏆' },
    { name: 'Draft 5v5', href: '/draft-master', icon: '🪄' },
    { name: 'Counter', href: '/counter-pick', icon: '⚔️' },
    { name: 'ฮีโร่', href: '/heroes', icon: '👥' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0b0c0e]/95 backdrop-blur-md border-t border-white/10 px-2 py-2 flex justify-around items-center font-mono">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1 px-1 rounded-lg text-[10px] transition ${
              isActive ? 'text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
