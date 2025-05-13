import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'kunden.json');

export async function GET() {
  const file = await fs.readFile(dataFilePath, 'utf8');
  const kunden = JSON.parse(file);
  return NextResponse.json(kunden);
}

export async function POST(request: Request) {
  const newKunde = await request.json();
  const file = await fs.readFile(dataFilePath, 'utf8');
  const kunden = JSON.parse(file);
  kunden.push(newKunde);
  await fs.writeFile(dataFilePath, JSON.stringify(kunden, null, 2));
  return NextResponse.json(newKunde, { status: 201 });
}
