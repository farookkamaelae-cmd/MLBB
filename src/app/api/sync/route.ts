import { NextResponse } from 'next/server';
import heroesData from '@/data/heroes.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ดึงสถิติจริงจาก MLBB Official Rank Data Endpoint
    const res = await fetch('https://m.mobilelegends.com/api/hero/list', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 86400 }, // Cache ข้อมูลไว้ 24 ชั่วโมง
    });

    if (res.ok) {
      const liveData = await res.json();
      return NextResponse.json({
        success: true,
        source: 'MLBB Official Live API',
        timestamp: new Date().toISOString(),
        data: liveData.data || heroesData,
      });
    }
  } catch (error) {
    console.warn('Fallback to local data engine due to network restriction');
  }

  return NextResponse.json({
    success: true,
    source: 'Local Engine (Fallback)',
    timestamp: new Date().toISOString(),
    data: heroesData,
  });
}
