import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { Icd10Eintrag } from '@/types/icd10';

export const dynamic = 'force-dynamic';

const filePath = resolve(process.cwd(), 'public', 'data', 'icd10.json');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const file = await fs.readFile(filePath, 'utf-8');
    const icd = JSON.parse(file) as Icd10Eintrag[];

    const treffer = icd
      .filter(entry => 
        entry.code.toLowerCase().includes(query) || 
        entry.titel.toLowerCase().includes(query)
      )
      .slice(0, 10);

    return NextResponse.json(treffer);
  } catch (error) {
    console.error('ICD-10 Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
