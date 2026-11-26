import { unstable_cache } from 'next/cache';
import type { Hero } from '@/utils/draftAnalysis';

const GMS_BASE = 'https://api.gms.moontontech.com/api/gms/source/2669606/';
const HERO_CATALOG_SOURCE = 2756564;
const ONE_DAY_RANKING_SOURCE = 2756567;
const PAGE_SIZE = 500;

interface GmsRecord<T> {
  data: T;
  _updatedAt?: number;
}

interface GmsResponse<T> {
  code: number;
  message?: string;
  data?: { records: GmsRecord<T>[]; total: number };
}

interface GmsPage<T> {
  rows: GmsRecord<T>[];
  updatedAt?: string;
}

interface OfficialHeroRecord {
  hero_id: number;
  hero?: { data?: Record<string, unknown> };
  relation?: {
    weak?: { desc?: string; target_hero_id?: number[] };
    assist?: { target_hero_id?: number[] };
  };
}

interface OfficialRankRecord {
  bigrank?: string | number;
  camp_type?: string | number;
  match_type?: string | number;
  main_heroid?: number | string;
  main_hero_win_rate?: number | string;
  main_hero_appearance_rate?: number | string;
  main_hero_ban_rate?: number | string;
}

async function requestGms<T>(sourceId: number, pageIndex: number, pageSize: number): Promise<GmsResponse<T>> {
  const response = await fetch(GMS_BASE + sourceId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageIndex, pageSize }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) throw new Error('Official MLBB data request failed with status ' + response.status);
  const result = (await response.json()) as GmsResponse<T>;
  if (result.code !== 0 || !result.data || !Array.isArray(result.data.records)) {
    throw new Error('Official MLBB data returned an unexpected response.');
  }
  return result;
}

async function readAllPages<T>(sourceId: number, pageSize: number): Promise<GmsPage<T>> {
  const first = await requestGms<T>(sourceId, 1, pageSize);
  const total = Math.max(0, Number(first.data?.total ?? first.data?.records.length ?? 0));
  const pageCount = Math.ceil(total / pageSize);
  const laterPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      requestGms<T>(sourceId, index + 2, pageSize)
    )
  );
  const rows = [
    ...(first.data?.records ?? []),
    ...laterPages.flatMap((page) => page.data?.records ?? []),
  ];
  const newest = rows.reduce((latest, row) => Math.max(latest, timestampMilliseconds(row._updatedAt)), 0);
  return { rows, updatedAt: newest ? new Date(newest).toISOString() : undefined };
}

const getOfficialCatalog = unstable_cache(
  () => readAllPages<OfficialHeroRecord>(HERO_CATALOG_SOURCE, 200),
  ['mlbb-official-hero-catalog-v1'],
  { revalidate: 3600 }
);

const getOfficialOneDayRankings = unstable_cache(
  () => readAllPages<OfficialRankRecord>(ONE_DAY_RANKING_SOURCE, PAGE_SIZE),
  ['mlbb-official-one-day-rankings-v1'],
  { revalidate: 300 }
);

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}

function numberValue(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function timestampMilliseconds(value: unknown): number {
  const parsed = numberValue(value);
  if (parsed === undefined) return 0;
  return parsed < 1_000_000_000_000 ? parsed * 1000 : parsed;
}

function numberList(value: unknown): number[] {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.replace(/\uFF0C/g, ',').split(/[,|]/) : [];
  return values.map(numberValue).filter((item): item is number => item !== undefined);
}

function percentage(value: unknown): string | undefined {
  const parsed = numberValue(value);
  return parsed === undefined ? undefined : (parsed * 100).toFixed(2) + '%';
}

function slugify(value: string, fallbackId: number): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'hero-' + fallbackId;
}

function normalizeLane(value: string): string {
  const lane = value.trim().toLowerCase();
  const names: Record<string, string> = {
    jungle: 'Jungler',
    jungling: 'Jungler',
    'gold lane': 'Gold Lane',
    'mid lane': 'Mid Lane',
    'exp lane': 'EXP Lane',
    roam: 'Roamer',
    roamer: 'Roamer',
  };
  return names[lane] ?? value.trim();
}

function stripMarkup(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;|&apos;/gi, "'")
    .trim();
}

function officialSkills(profile: Record<string, unknown>) {
  const groups = Array.isArray(profile.heroskilllist) ? profile.heroskilllist : [];
  return groups.flatMap((group) => {
    if (!group || typeof group !== 'object') return [];
    const list = Array.isArray((group as { skilllist?: unknown }).skilllist)
      ? (group as { skilllist: unknown[] }).skilllist
      : [];
    return list.flatMap((skill) => {
      if (!skill || typeof skill !== 'object') return [];
      const item = skill as Record<string, unknown>;
      const name = stripMarkup(item.skillname);
      if (!name) return [];
      return [{ name, description: stripMarkup(item.skilldesc), iconUrl: typeof item.skillicon === 'string' ? item.skillicon : '' }];
    });
  });
}

export interface OfficialHeroData {
  heroes: Hero[];
  source: string;
  period: string;
  catalogUpdatedAt?: string;
  rankingUpdatedAt?: string;
  rankingWarning?: string;
}

export async function getOfficialHeroData(): Promise<OfficialHeroData> {
  const [catalogResult, rankingResult] = await Promise.allSettled([
    getOfficialCatalog(),
    getOfficialOneDayRankings(),
  ]);
  if (catalogResult.status === 'rejected') throw catalogResult.reason;
  const catalog = catalogResult.value;
  const rankings = rankingResult.status === 'fulfilled'
    ? rankingResult.value
    : { rows: [] as GmsRecord<OfficialRankRecord>[], updatedAt: undefined };
  const validCatalog = catalog.rows.filter((row) => row.data?.hero?.data && typeof row.data.hero.data.name === 'string');
  const idToSlug = new Map(
    validCatalog.map((row) => [String(row.data.hero_id), slugify(String(row.data.hero?.data?.name), row.data.hero_id)])
  );

  const dailyRankRows = rankings.rows
    .filter((row) => {
      const data = row.data;
      return String(data.bigrank) === '101' && String(data.camp_type) === '0' && String(data.match_type) === '0';
    })
    .map((row) => row.data);
  const rankById = new Map<number, { rank: number; winRate?: string; pickRate?: string; banRate?: string }>();
  dailyRankRows
    .slice()
    .sort((left, right) => (numberValue(right.main_hero_win_rate) ?? 0) - (numberValue(left.main_hero_win_rate) ?? 0))
    .forEach((row) => {
      const officialHeroId = numberValue(row.main_heroid);
      if (officialHeroId === undefined || rankById.has(officialHeroId)) return;
      rankById.set(officialHeroId, {
        rank: rankById.size + 1,
        winRate: percentage(row.main_hero_win_rate),
        pickRate: percentage(row.main_hero_appearance_rate),
        banRate: percentage(row.main_hero_ban_rate),
      });
    });

  const heroes = validCatalog.map((row) => {
    const profile = row.data.hero?.data as Record<string, unknown>;
    const officialId = row.data.hero_id;
    const id = idToSlug.get(String(officialId)) ?? slugify(String(profile.name), officialId);
    const ranking = rankById.get(officialId);
    const abilityBars = numberList(profile.abilityshow);
    const roles = strings(profile.sortlabel);
    const lanes = Array.isArray(profile.roadsort)
      ? profile.roadsort.flatMap((entry) => {
          if (!entry || typeof entry !== 'object') return [];
          const data = (entry as { data?: { road_sort_title?: unknown } }).data;
          return typeof data?.road_sort_title === 'string' ? [normalizeLane(data.road_sort_title)] : [];
        })
      : [];
    const relation = row.data.relation;
    const weakIds = Array.isArray(relation?.weak?.target_hero_id) ? relation.weak.target_hero_id : [];
    const assistIds = Array.isArray(relation?.assist?.target_hero_id) ? relation.assist.target_hero_id : [];
    const counteredBy = weakIds.flatMap((targetId) => {
      const heroId = idToSlug.get(String(targetId));
      return heroId ? [{ heroId, reason: stripMarkup(relation?.weak?.desc) }] : [];
    });
    const synergyWith = assistIds.flatMap((targetId) => {
      const heroId = idToSlug.get(String(targetId));
      return heroId ? [heroId] : [];
    });
    const image = typeof profile.smallmap === 'string' ? profile.smallmap : typeof profile.head === 'string' ? profile.head : '';

    return {
      id,
      officialId,
      name: String(profile.name),
      role: roles[0] ?? 'Unknown',
      roles: roles.length ? roles : ['Unknown'],
      lanes: Array.from(new Set(lanes)),
      avatarUrl: image,
      portraitUrl: typeof profile.head === 'string' ? profile.head : image,
      counteredBy,
      synergyWith,
      winRate: ranking?.winRate,
      pickRate: ranking?.pickRate,
      banRate: ranking?.banRate,
      rank: ranking?.rank,
      officialRatings: {
        durability: abilityBars[0],
        offense: abilityBars[1],
        abilityEffects: abilityBars[2],
        difficulty: numberValue(profile.difficulty) ?? abilityBars[3],
      },
      skills: officialSkills(profile),
    } satisfies Hero;
  });

  const rankingTimes = rankings.rows
    .filter((row) => String(row.data.bigrank) === '101' && String(row.data.camp_type) === '0' && String(row.data.match_type) === '0')
    .map((row) => timestampMilliseconds(row._updatedAt));
  const rankingUpdatedAt = rankingTimes.length ? new Date(Math.max(...rankingTimes)).toISOString() : rankings.updatedAt;

  return {
    heroes,
    source: 'MLBB official website (Moonton GMS)',
    period: 'Past 1 day · ALL ranks',
    catalogUpdatedAt: catalog.updatedAt,
    rankingUpdatedAt,
    rankingWarning: rankingResult.status === 'rejected'
      ? 'Official ranking data is temporarily unavailable; hero profiles are still available.'
      : undefined,
  };
}
