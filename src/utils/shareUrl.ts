import type { Hero } from './draftAnalysis';

export function generateShareUrl(enemyPicks: (Hero | null)[], allyPicks: (Hero | null)[], bannedHeroes: (Hero | null)[]): string {
  const e = enemyPicks.map((h) => h?.id || '').join(',');
  const a = allyPicks.map((h) => h?.id || '').join(',');
  const b = bannedHeroes.map((h) => h?.id || '').join(',');

  const params = new URLSearchParams();
  if (e) params.set('e', e);
  if (a) params.set('a', a);
  if (b) params.set('b', b);

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/draft-master?${params.toString()}`;
  }
  return `?${params.toString()}`;
}

export function parseShareUrl(searchParams: URLSearchParams, allHeroes: Hero[]) {
  const eStr = searchParams.get('e') || '';
  const aStr = searchParams.get('a') || '';
  const bStr = searchParams.get('b') || '';

  const getHeroList = (str: string, length: number) => {
    const ids = str.split(',');
    const list: (Hero | null)[] = [];
    for (let i = 0; i < length; i++) {
      const found = allHeroes.find((h) => h.id === ids[i]);
      list.push(found || null);
    }
    return list;
  };

  return {
    enemyPicks: getHeroList(eStr, 5),
    allyPicks: getHeroList(aStr, 5),
    bannedHeroes: getHeroList(bStr, 10),
  };
}
