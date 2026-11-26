'use client';

import React, { useState } from 'react';
import { Hero } from '@/utils/draftAnalysis';
import { useHeroes } from '@/hooks/useHeroes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const ratingFields = [
  { key: 'durability', label: 'Durability' },
  { key: 'offense', label: 'Offense' },
  { key: 'abilityEffects', label: 'Ability effects' },
  { key: 'difficulty', label: 'Difficulty' },
] as const;

export default function HeroesListPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 250);
  const { heroes: allHeroes, loading, error, reload, source, period, rankingWarning, updatedAt, catalogUpdatedAt } = useHeroes();
  const query = debouncedSearch.trim().toLocaleLowerCase();
  const heroes = allHeroes.filter((hero) =>
    (role === 'All' || hero.roles?.includes(role) || hero.role === role) && (!query || hero.name.toLocaleLowerCase().includes(query))
  );
  const selectedHero = allHeroes.find((hero) => hero.id === selectedHeroId) ?? null;
  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 font-mono sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold uppercase text-white">Hero database</h1>
          <p className="mt-1 text-xs text-slate-400">Official profiles, skills, relations, and play rates from the MLBB website.</p>
          <p className="mt-1 text-[10px] text-slate-500">{source}{period ? ' | ' + period : ''}{updatedAt ? ' | Ranking updated ' + new Date(updatedAt).toLocaleString() : ''}{catalogUpdatedAt ? ' | Catalog updated ' + new Date(catalogUpdatedAt).toLocaleString() : ''}</p>
          {rankingWarning ? <p role="status" className="text-xs text-amber-300">{rankingWarning}</p> : null}
        </div>
        <input type="search" placeholder="Search heroes..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#121317] px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none sm:w-56" aria-label="Search heroes" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {roles.map((item) => <button key={item} type="button" onClick={() => setRole(item)} className={'whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ' + (role === item ? 'border border-blue-400 bg-blue-600 text-white' : 'bg-[#121317] text-slate-400 hover:bg-slate-800')}>{item}</button>)}
      </div>

      {loading ? <div className="py-12 text-center text-xs text-slate-500">Loading hero data...</div> : error ? (
        <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-200">{error}<button type="button" onClick={reload} className="ml-3 underline">Retry</button></div>
      ) : heroes.length === 0 ? <div className="py-12 text-center text-xs text-slate-500">No heroes found for this filter.</div> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {heroes.map((hero) => <button key={hero.id} type="button" onClick={() => setSelectedHeroId(hero.id)} className="group flex flex-col items-center rounded-2xl border border-white/10 bg-[#121317] p-3 text-left transition hover:border-blue-500/60">
            <div className="mb-2 h-16 w-16 overflow-hidden rounded-xl border border-white/5 bg-slate-950 transition group-hover:scale-105">{hero.avatarUrl ? <img src={hero.avatarUrl} alt={hero.name} loading="lazy" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-blue-300">{hero.name.slice(0, 2)}</span>}</div>
            <h2 className="w-full truncate text-center text-xs font-bold text-white">{hero.name}</h2>
            <span className="block text-[10px] text-blue-400">{(hero.roles ?? [hero.role]).join(' / ')}</span>
            <span className="mt-1 block text-[9px] text-emerald-400">WR: {hero.winRate ?? '-'}</span>
          </button>)}
        </div>
      )}

      {selectedHero && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedHeroId(null); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="hero-detail-title" className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl border border-white/15 bg-[#121317] p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">{(selectedHero.portraitUrl ?? selectedHero.avatarUrl) && <img src={selectedHero.portraitUrl ?? selectedHero.avatarUrl} alt="" className="h-12 w-12 rounded-xl border border-blue-500 object-cover" />}<div><h2 id="hero-detail-title" className="text-lg font-bold text-white">{selectedHero.name}</h2><p className="text-xs text-blue-400">{(selectedHero.roles ?? [selectedHero.role]).join(' / ')} | {selectedHero.lanes.join(', ') || '-'}</p></div></div>
            <button type="button" onClick={() => setSelectedHeroId(null)} aria-label="Close" className="text-xl text-slate-400 hover:text-white">×</button>
          </div>

          <section className="grid grid-cols-3 gap-2 rounded-xl bg-[#0b0c0e] p-3 text-center text-xs">
            <div><span className="block text-[10px] text-slate-500">WIN RATE</span><span className="font-bold text-emerald-400">{selectedHero.winRate ?? '-'}</span></div>
            <div><span className="block text-[10px] text-slate-500">PICK RATE</span><span className="font-bold text-slate-200">{selectedHero.pickRate ?? '-'}</span></div>
            <div><span className="block text-[10px] text-slate-500">BAN RATE</span><span className="font-bold text-red-400">{selectedHero.banRate ?? '-'}</span></div>
          </section>

          <section className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-blue-300">Official in-game ratings</h3><div className="grid gap-3 sm:grid-cols-2">
            {ratingFields.map((field) => { const value = selectedHero.officialRatings?.[field.key]; return <div key={field.key} className="rounded-xl bg-[#0b0c0e] p-3"><div className="mb-2 flex justify-between text-[10px] text-slate-400"><span>{field.label}</span><span>{value ?? '-'}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-blue-500" style={{ width: Math.min(100, Math.max(0, value ?? 0)) + '%' }} /></div></div>; })}
          </div></section>

          <section className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-blue-300">Official skills</h3>
            {selectedHero.skills?.length ? <div className="space-y-2">{selectedHero.skills.map((skill, index) => <article key={skill.name + index} className="flex gap-3 rounded-xl border border-white/5 bg-[#0b0c0e] p-3">{skill.iconUrl && <img src={skill.iconUrl} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover" />}<div className="space-y-1"><h4 className="text-xs font-bold text-white">{skill.name}</h4><p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-300">{skill.description || '-'}</p></div></article>)}</div> : <p className="text-xs text-slate-500">No skill details are available in the official feed.</p>}
          </section>

          <section className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-blue-300">Official hero relations</h3><div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#0b0c0e] p-3"><h4 className="mb-2 text-[10px] font-bold text-emerald-300">WEAK AGAINST</h4>{selectedHero.counteredBy.length ? <ul className="space-y-2">{selectedHero.counteredBy.map((relation) => { const counter = allHeroes.find((hero) => hero.id === relation.heroId); return <li key={relation.heroId} className="text-xs text-slate-300"><span className="font-bold text-white">{counter?.name ?? relation.heroId}</span>{relation.reason ? <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{relation.reason}</p> : null}</li>; })}</ul> : <p className="text-[10px] text-slate-500">No listed counter relation.</p>}</div>
            <div className="rounded-xl bg-[#0b0c0e] p-3"><h4 className="mb-2 text-[10px] font-bold text-purple-300">SYNERGY</h4>{selectedHero.synergyWith?.length ? <ul className="space-y-1">{selectedHero.synergyWith.map((id) => <li key={id} className="text-xs text-slate-300">{allHeroes.find((hero) => hero.id === id)?.name ?? id}</li>)}</ul> : <p className="text-[10px] text-slate-500">No listed synergy relation.</p>}</div>
          </div></section>
          <p className="text-[10px] leading-relaxed text-slate-500">Official hero profiles do not currently provide builds or spell recommendations in this feed.</p>
        </div>
      </div>}
    </div>
  );
}
