import { NextResponse } from 'next/server';
import heroesData from '@/data/heroes.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const lane = searchParams.get('lane');
  const search = searchParams.get('search');

  let heroes = [...heroesData];

  if (search) {
    heroes = heroes.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));
  }
  if (role && role !== 'All') {
    heroes = heroes.filter((h) => h.role === role);
  }
  if (lane && lane !== 'All') {
    heroes = heroes.filter((h) => h.lanes.includes(lane));
  }

  return NextResponse.json({
    success: true,
    total: heroes.length,
    updatedAt: new Date().toISOString(),
    data: heroes,
  });
}
