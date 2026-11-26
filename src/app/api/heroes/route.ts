import { NextResponse } from 'next/server';
import { getOfficialHeroData } from '@/utils/mlbbOfficial';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const role = params.get('role');
  const lane = params.get('lane');
  const search = params.get('search')?.trim().toLocaleLowerCase();

  try {
    const official = await getOfficialHeroData();
    const data = official.heroes
      .filter((hero) => !role || role === 'All' || hero.roles?.includes(role) || hero.role === role)
      .filter((hero) => !lane || lane === 'All' || hero.lanes.includes(lane))
      .filter((hero) => !search || hero.name.toLocaleLowerCase().includes(search));

    return NextResponse.json({
      success: true,
      total: data.length,
      source: official.source,
      period: official.period,
      rankingWarning: official.rankingWarning,
      updatedAt: official.rankingUpdatedAt ?? official.catalogUpdatedAt,
      catalogUpdatedAt: official.catalogUpdatedAt,
      data,
    });
  } catch (error) {
    console.error('Official MLBB data request failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to load the latest official MLBB data.' },
      { status: 502 }
    );
  }
}
