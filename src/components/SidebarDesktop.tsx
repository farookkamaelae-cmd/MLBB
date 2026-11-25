'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SidebarDesktop: React.FC = () => {
  const pathname = usePathname();

  const menuGroups = [
    {
      group: 'แดชบอร์ด',
      items: [
        { name: 'หน้าแรก / แดชบอร์ด', href: '/', icon: '📊' },
      ],
    },
    {
      group: 'ฮีโร่',
      items: [
        { name: 'ฮีโร่ทั้งหมด', href: '/heroes', icon: '👥' },
        { name: 'Tier List', href: '/tier-list', icon: '🏆' },
        { name: 'Counter Pick', href: '/counter-pick', icon: '⚔️' },
        { name: 'Draft Master (5v5)', href: '/draft-master', icon: '🪄' },
        { name: 'สถิติฮีโร่', href: '/stats', icon: '📈' },
        { name: 'Matchup Comparison', href: '/matchup', icon: '⚖️' },
        { name: 'องค์ประกอบทีม', href: '/team-comp', icon: '🧩' },
      ],
    },
    {
      group: 'ไอเทม',
      items: [
        { name: 'Item Build', href: '/item-build', icon: '🔨' },
        { name: 'รายการไอเทม', href: '/items', icon: '📦' },
        { name: 'Emblem Set', href: '/emblem', icon: '🎖️' },
      ],
    },
    {
      group: 'ชุมชน & เพิ่มเติม',
      items: [
        { name: 'การสนทนา & เทคนิค', href: '/community', icon: '💬' },
        { name: 'อัปเดตแพตช์', href: '/patch-notes', icon: '📣' },
        { name: 'เกี่ยวกับเรา', href: '/about', icon: 'ℹ️' },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0b0c0e] h-screen sticky top-0 overflow-y-auto p-4 shrink-0 font-mono">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-4 px-2">
        <div className="w-9 h-9 rounded-full border border-blue-500/50 bg-[#121317] flex items-center justify-center text-blue-400 font-bold shadow-[0_0_12px_rgba(61,123,255,0.3)]">
          AP
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-widest text-[#eef0f3]">
            APERTURE <span className="text-blue-500">MLBB</span>
          </h1>
          <p className="text-[9px] text-[#8d929b] tracking-wider">PRO DRAFT ENGINE</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="space-y-6 flex-1">
        {menuGroups.map((g, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#8d929b] px-3 font-semibold">
              {g.group}
            </span>
            <div className="space-y-0.5 mt-1">
              {g.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
