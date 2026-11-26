export interface CounterDetail {
  heroId: string;
  reason: string;
}

export interface OfficialHeroRatings {
  durability?: number;
  offense?: number;
  abilityEffects?: number;
  difficulty?: number;
}

export interface HeroSkill {
  name: string;
  description: string;
  iconUrl: string;
}

export interface Hero {
  id: string;
  officialId?: number;
  name: string;
  role: string;
  roles?: string[];
  lanes: string[];
  officialRatings?: OfficialHeroRatings;
  skills?: HeroSkill[];
  avatarUrl: string;
  portraitUrl?: string;
  synergyWith?: string[];
  counteredBy: CounterDetail[];
  rank?: number;
  winRate?: string;
  pickRate?: string;
  banRate?: string;
}

export interface TargetReason {
  targetHeroName: string;
  reason: string;
}

export interface RecommendedCounter {
  hero: Hero;
  coverageCount: number;
  reasons: TargetReason[];
}

export function getRecommendedCounters(
  selectedEnemyIds: string[],
  selectedAllyIds: string[],
  bannedIds: string[],
  allHeroes: Hero[]
): RecommendedCounter[] {
  const validEnemyIds = selectedEnemyIds.filter(Boolean);
  if (validEnemyIds.length === 0) return [];

  const unavailableIds = new Set([...selectedEnemyIds, ...selectedAllyIds, ...bannedIds]);
  const map: { [heroId: string]: { coverageCount: number; reasons: TargetReason[] } } = {};

  validEnemyIds.forEach((enemyId) => {
    const enemyHero = allHeroes.find((h) => h.id === enemyId);
    if (!enemyHero) return;

    enemyHero.counteredBy?.forEach((cb) => {
      if (unavailableIds.has(cb.heroId)) return;

      if (!map[cb.heroId]) {
        map[cb.heroId] = { coverageCount: 0, reasons: [] };
      }

      map[cb.heroId].coverageCount += 1;
      map[cb.heroId].reasons.push({
        targetHeroName: enemyHero.name,
        reason: cb.reason,
      });
    });
  });

  const results: RecommendedCounter[] = [];

  Object.entries(map).forEach(([counterHeroId, data]) => {
    const counterHero = allHeroes.find((h) => h.id === counterHeroId);
    if (counterHero) {
      results.push({
        hero: counterHero,
        coverageCount: data.coverageCount,
        reasons: data.reasons,
      });
    }
  });

  return results.sort((a, b) => {
    if (b.coverageCount !== a.coverageCount) return b.coverageCount - a.coverageCount;
    if (b.reasons.length !== a.reasons.length) {
      return b.reasons.length - a.reasons.length;
    }
    return a.hero.name.localeCompare(b.hero.name);
  });
}
