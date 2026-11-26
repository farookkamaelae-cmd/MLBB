import { create } from 'zustand';
import { Hero } from '@/utils/draftAnalysis';

export type SlotType = 'enemy' | 'ally' | 'ban';

interface DraftState {
  enemyPicks: (Hero | null)[];
  allyPicks: (Hero | null)[];
  bannedHeroes: (Hero | null)[];
  activeSlot: { type: SlotType; index: number } | null;
  
  openModal: (type: SlotType, index: number) => void;
  closeModal: () => void;
  selectHero: (hero: Hero) => void;
  refreshHeroData: (heroes: Hero[]) => void;
  loadDraft: (draft: {
    enemyPicks: (Hero | null)[];
    allyPicks: (Hero | null)[];
    bannedHeroes: (Hero | null)[];
  }) => void;
  removeHero: (type: SlotType, index: number) => void;
  swapTeams: () => void;
  resetAll: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  enemyPicks: [null, null, null, null, null],
  allyPicks: [null, null, null, null, null],
  bannedHeroes: [null, null, null, null, null, null, null, null, null, null],
  activeSlot: null,

  openModal: (type, index) => set({ activeSlot: { type, index } }),
  closeModal: () => set({ activeSlot: null }),

  selectHero: (hero) =>
    set((state) => {
      if (!state.activeSlot) return state;
      const { type, index } = state.activeSlot;
      if (type === 'enemy') {
        const updated = [...state.enemyPicks];
        updated[index] = hero;
        return { enemyPicks: updated, activeSlot: null };
      } else if (type === 'ally') {
        const updated = [...state.allyPicks];
        updated[index] = hero;
        return { allyPicks: updated, activeSlot: null };
      } else {
        const updated = [...state.bannedHeroes];
        updated[index] = hero;
        return { bannedHeroes: updated, activeSlot: null };
      }
    }),

  refreshHeroData: (heroes) =>
    set((state) => {
      const byId = new Map(heroes.map((hero) => [hero.id, hero]));
      const refreshPicks = (picks: (Hero | null)[]) => picks.map((hero) => hero ? byId.get(hero.id) ?? hero : null);
      return {
        enemyPicks: refreshPicks(state.enemyPicks),
        allyPicks: refreshPicks(state.allyPicks),
        bannedHeroes: refreshPicks(state.bannedHeroes),
      };
    }),

  loadDraft: (draft) =>
    set({
      enemyPicks: draft.enemyPicks,
      allyPicks: draft.allyPicks,
      bannedHeroes: draft.bannedHeroes,
      activeSlot: null,
    }),

  removeHero: (type, index) =>
    set((state) => {
      if (type === 'enemy') {
        const updated = [...state.enemyPicks];
        updated[index] = null;
        return { enemyPicks: updated };
      } else if (type === 'ally') {
        const updated = [...state.allyPicks];
        updated[index] = null;
        return { allyPicks: updated };
      } else {
        const updated = [...state.bannedHeroes];
        updated[index] = null;
        return { bannedHeroes: updated };
      }
    }),

  swapTeams: () =>
    set((state) => ({
      enemyPicks: [...state.allyPicks],
      allyPicks: [...state.enemyPicks],
      activeSlot: null,
    })),

  resetAll: () =>
    set({
      enemyPicks: [null, null, null, null, null],
      allyPicks: [null, null, null, null, null],
      bannedHeroes: [null, null, null, null, null, null, null, null, null, null],
      activeSlot: null,
    }),
}));
