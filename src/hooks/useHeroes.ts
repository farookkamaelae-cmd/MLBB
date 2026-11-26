'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Hero } from '@/utils/draftAnalysis';

interface HeroesResponse {
  success: boolean;
  error?: string;
  source?: string;
  period?: string;
  rankingWarning?: string;
  updatedAt?: string;
  catalogUpdatedAt?: string;
  data?: Hero[];
}

const clientHeroCache = new Map<string, HeroesResponse>();
const SESSION_CACHE_PREFIX = 'mlbb-heroes-cache-v1:';

function readSessionCache(key: string): HeroesResponse | undefined {
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
    if (!raw) return undefined;
    const value = JSON.parse(raw) as HeroesResponse;
    if (!value.success || !Array.isArray(value.data)) return undefined;
    clientHeroCache.set(key, value);
    return value;
  } catch {
    return undefined;
  }
}

function writeSessionCache(key: string, value: HeroesResponse) {
  try {
    window.sessionStorage.setItem(SESSION_CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Keep the in-memory cache when session storage is unavailable.
  }
}

export function useHeroes(filters: { role?: string; search?: string } = {}) {
  const role = filters.role ?? 'All';
  const search = filters.search ?? '';
  const params = new URLSearchParams();
  if (role !== 'All') params.set('role', role);
  if (search.trim()) params.set('search', search.trim());
  const query = params.toString();
  const cacheKey = query || 'all-heroes';
  const initialResponse = clientHeroCache.get(cacheKey);
  const [heroes, setHeroes] = useState<Hero[]>(initialResponse?.data ?? []);
  const [loading, setLoading] = useState(!initialResponse?.data);
  const [error, setError] = useState('');
  const [source, setSource] = useState(initialResponse?.source ?? '');
  const [period, setPeriod] = useState(initialResponse?.period ?? '');
  const [rankingWarning, setRankingWarning] = useState(initialResponse?.rankingWarning ?? '');
  const [updatedAt, setUpdatedAt] = useState(initialResponse?.updatedAt ?? '');
  const [catalogUpdatedAt, setCatalogUpdatedAt] = useState(initialResponse?.catalogUpdatedAt ?? '');
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    const cachedResponse = clientHeroCache.get(cacheKey) ?? readSessionCache(cacheKey);
    if (cachedResponse?.data) {
      setHeroes(cachedResponse.data);
      setSource(cachedResponse.source ?? '');
      setPeriod(cachedResponse.period ?? '');
      setRankingWarning(cachedResponse.rankingWarning ?? '');
      setUpdatedAt(cachedResponse.updatedAt ?? '');
      setCatalogUpdatedAt(cachedResponse.catalogUpdatedAt ?? '');
      setLoading(false);
    } else {
      setHeroes([]);
      setLoading(true);
    }
    setError('');

    const controller = new AbortController();
    fetch('/api/heroes' + (query ? '?' + query : ''), {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (response) => {
        const body = (await response.json()) as HeroesResponse;
        if (!response.ok || !body.success || !Array.isArray(body.data)) {
          throw new Error(body.error || 'Unable to load heroes.');
        }
        clientHeroCache.set(cacheKey, body);
        writeSessionCache(cacheKey, body);
        if (controller.signal.aborted) return;
        setHeroes(body.data);
        setSource(body.source ?? '');
        setPeriod(body.period ?? '');
        setRankingWarning(body.rankingWarning ?? '');
        setUpdatedAt(body.updatedAt ?? '');
        setCatalogUpdatedAt(body.catalogUpdatedAt ?? '');
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted || cachedResponse?.data) return;
        setError(reason instanceof Error ? reason.message : 'Unable to load heroes.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [cacheKey, query, reloadKey]);

  useEffect(() => {
    const timer = window.setInterval(() => setReloadKey((key) => key + 1), 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return { heroes, loading, error, reload, source, period, rankingWarning, updatedAt, catalogUpdatedAt };
}
