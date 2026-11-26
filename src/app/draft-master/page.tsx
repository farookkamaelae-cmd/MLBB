'use client';

import React, { useEffect, useRef } from 'react';
import { Hero } from '@/utils/draftAnalysis';
import { parseShareUrl } from '@/utils/shareUrl';
import { useDraftStore } from '@/store/useDraftStore';
import { useHeroes } from '@/hooks/useHeroes';
import { DraftStage } from '@/components/DraftStage';
import { TeamSynergyPanel } from '@/components/TeamSynergyPanel';
import { CounterRecommendationPanel } from '@/components/CounterRecommendationPanel';
import { HeroSearchModal } from '@/components/HeroSearchModal';

export default function DraftMasterPage() {
  const { heroes: allHeroes, loading, error, reload } = useHeroes();
  const loadDraft = useDraftStore((state) => state.loadDraft);
  const refreshHeroData = useDraftStore((state) => state.refreshHeroData);
  const initialDraftLoaded = useRef(false);

  useEffect(() => {
    if (!allHeroes.length) return;
    if (!initialDraftLoaded.current) {
      initialDraftLoaded.current = true;
      const searchParams = new URLSearchParams(window.location.search);
      if (['e', 'a', 'b'].some((key) => searchParams.has(key))) {
        loadDraft(parseShareUrl(searchParams, allHeroes));
      }
    }
    refreshHeroData(allHeroes);
  }, [allHeroes, loadDraft, refreshHeroData]);

  if (loading) return <div className="p-8 text-center text-sm text-slate-400">Loading hero data…</div>;
  if (error) return <div role="alert" className="m-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 text-amber-200">{error}<button onClick={reload} className="ml-4 underline">Retry</button></div>;

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
      <CounterRecommendationPanel allHeroes={allHeroes} />
      <HeroSearchModal allHeroes={allHeroes} />
    </div>
  );
}
