'use client';

import React, { useState } from 'react';
import { useDraftStore } from '@/store/useDraftStore';
import { generateShareUrl } from '@/utils/shareUrl';

export const ShareDraftButton: React.FC = () => {
  const { enemyPicks, allyPicks, bannedHeroes } = useDraftStore();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopyLink = async () => {
    const url = generateShareUrl(enemyPicks, allyPicks, bannedHeroes);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
    window.setTimeout(() => {
      setCopied(false);
      setCopyFailed(false);
    }, 2500);
  };

  return (
    <button
      type="button"
      onClick={handleCopyLink}
      aria-live="polite"
      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2"
    >
      <span>{copied ? '✅ คัดลอกลิงก์แล้ว!' : copyFailed ? 'คัดลอกไม่สำเร็จ' : '🔗 แชร์แผน DRAFT นี้'}</span>
    </button>
  );
};
