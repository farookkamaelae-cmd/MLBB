export interface CounterDetail {
  heroId: string;
  score: number;
  reason: string;
}

export interface HeroStats {
  cc: number;
  burst: number;
  durability: number;
  mobility: number;
  scaling: number;
}

export interface Hero {
  id: string;
  name: string;
  role: string;
  lanes: string[];
  damageType: 'Physical' | 'Magic' | 'True' | 'Hybrid';
  stats: HeroStats;
  avatarUrl: string;
  synergyWith?: string[];
  counteredBy: CounterDetail[];
  tier?: string;
  winRate?: string;
  pickRate?: string;
  banRate?: string;
  recommendedBuild?: string[];
  recommendedSpells?: string[];
  counterItems?: string[];
}

export interface TargetReason {
  targetHeroName: string;
  reason: string;
  score: number;
}

export interface RecommendedCounter {
  hero: Hero;
  totalScore: number;
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
  const map: { [heroId: string]: { totalScore: number; reasons: TargetReason[] } } = {};

  validEnemyIds.forEach((enemyId) => {
    const enemyHero = allHeroes.find((h) => h.id === enemyId);
    if (!enemyHero) return;

    enemyHero.counteredBy?.forEach((cb) => {
      if (unavailableIds.has(cb.heroId)) return;

      if (!map[cb.heroId]) {
        map[cb.heroId] = { totalScore: 0, reasons: [] };
      }

      map[cb.heroId].totalScore += cb.score;
      map[cb.heroId].reasons.push({
        targetHeroName: enemyHero.name,
        reason: cb.reason,
        score: cb.score,
      });
    });
  });

  const results: RecommendedCounter[] = [];

  Object.entries(map).forEach(([counterHeroId, data]) => {
    const counterHero = allHeroes.find((h) => h.id === counterHeroId);
    if (counterHero) {
      results.push({
        hero: counterHero,
        totalScore: data.totalScore,
        reasons: data.reasons,
      });
    }
  });

  return results.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.reasons.length !== a.reasons.length) {
      return b.reasons.length - a.reasons.length;
    }
    return a.hero.name.localeCompare(b.hero.name);
  });
}

export function calculateTeamStats(allyIds: string[], allHeroes: Hero[]): HeroStats {
  const selected = allyIds.map((id) => allHeroes.find((h) => h.id === id)).filter((h): h is Hero => !!h);
  if (selected.length === 0) {
    return { cc: 0, burst: 0, durability: 0, mobility: 0, scaling: 0 };
  }

  const totals = selected.reduce(
    (acc, hero) => ({
      cc: acc.cc + hero.stats.cc,
      burst: acc.burst + hero.stats.burst,
      durability: acc.durability + hero.stats.durability,
      mobility: acc.mobility + hero.stats.mobility,
      scaling: acc.scaling + hero.stats.scaling,
    }),
    { cc: 0, burst: 0, durability: 0, mobility: 0, scaling: 0 }
  );

  const count = selected.length;
  return {
    cc: Math.round((totals.cc / count) * 10),
    burst: Math.round((totals.burst / count) * 10),
    durability: Math.round((totals.durability / count) * 10),
    mobility: Math.round((totals.mobility / count) * 10),
    scaling: Math.round((totals.scaling / count) * 10),
  };
}

export function calculateDamageTypeRatio(allyIds: string[], allHeroes: Hero[]) {
  const selected = allyIds.map((id) => allHeroes.find((h) => h.id === id)).filter((h): h is Hero => !!h);
  if (selected.length === 0) return { physical: 0, magic: 0, trueDmg: 0 };

  let phys = 0, mag = 0, tru = 0;
  selected.forEach((h) => {
    if (h.damageType === 'Physical') phys += 1;
    else if (h.damageType === 'Magic') mag += 1;
    else if (h.damageType === 'Hybrid') { phys += 0.5; mag += 0.5; }
    else if (h.damageType === 'True') tru += 1;
  });

  const total = selected.length;
  return {
    physical: Math.round((phys / total) * 100),
    magic: Math.round((mag / total) * 100),
    trueDmg: Math.round((tru / total) * 100),
  };
}

export function getDraftWarnings(allyIds: string[], allHeroes: Hero[]): string[] {
  const warnings: string[] = [];
  const selected = allyIds.map((id) => allHeroes.find((h) => h.id === id)).filter((h): h is Hero => !!h);
  if (selected.length < 2) return warnings;

  const hasRoamer = selected.some((h) => h.lanes.includes('Roamer') || h.role === 'Tank' || h.role === 'Support');
  const hasJungler = selected.some((h) => h.lanes.includes('Jungler'));
  const hasMage = selected.some((h) => h.role === 'Mage');

  if (!hasRoamer) warnings.push('⚠️ ทีมยังขาดตัวสร้างจังหวะ / Roamer');
  if (!hasJungler && selected.length >= 3) warnings.push('⚠️ ทีมยังไม่มี Jungler หลัก');
  if (!hasMage && selected.length >= 3) warnings.push('⚠️ ทีมขาด Magic Damage จากสาย Mage');

  const damageRatio = calculateDamageTypeRatio(allyIds, allHeroes);
  if (damageRatio.physical >= 80) warnings.push('⚠️ ดาเมจกายภาพสูงเกินไป (เสี่ยงแพ้ทางไอเทมแทงค์ Physical)');
  if (damageRatio.magic >= 80) warnings.push('⚠️ ดาเมจเวทสูงเกินไป (เสี่ยงโดนออก Radiant/Athena ข่ม)');

  return warnings;
}
