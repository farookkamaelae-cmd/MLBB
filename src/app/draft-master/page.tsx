'use client';

import React, { useEffect } from 'react';
import heroesData from '@/data/heroes.json';
import { Hero } from '@/utils/draftAnalysis';
import { parseShareUrl } from '@/utils/shareUrl';
import { useDraftStore } from '@/store/useDraftStore';
import { DraftStage } from '@/components/DraftStage';
import { TeamSynergyPanel } from '@/components/TeamSynergyPanel';
import { CounterRecommendationPanel } from '@/components/CounterRecommendationPanel';
import { HeroSearchModal } from '@/components/HeroSearchModal';

export default function DraftMasterPage() {
  const allHeroes: Hero[] = heroesData as any[];
  const loadDraft = useDraftStore((state) => state.loadDraft);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (['e', 'a', 'b'].some((key) => searchParams.has(key))) {
      loadDraft(parseShareUrl(searchParams, allHeroes));
    }
  }, [allHeroes, loadDraft]);

  return (
    <div className="p-4 sm:p-8 space-y-6 font-mono max-w-6xl mx-auto">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <h1 className="text-2xl font-extrabold text-white uppercase flex items-center gap-2">
          🪄 DRAFT MASTER 5v5 (ระบบจำลอง ดราฟต์แข่งขัน)
        </h1>
        <p className="text-xs text-slate-400">
          จำลองการเลือกฝั่งเรา ฝั่งตรงข้าม และการ Ban เพื่อวิเคราะห์ความสมดุลและคำนวณตัวแก้ทาง
        </p>
      </div>

      <DraftStage />
      <TeamSynergyPanel />
      <CounterRecommendationPanel />
      <HeroSearchModal allHeroes={allHeroes} />
    </div>
  );
}
