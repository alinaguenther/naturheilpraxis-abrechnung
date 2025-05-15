import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chaptersDir = path.join(__dirname, '../data/icd10-html');

export type KapitelZuordnung = {
  codeVon: string;
  codeBis: string;
  kapitel: string;
  titel: string;
};

export async function parseKapiteldateien(): Promise<KapitelZuordnung[]> {
  const files = (await fs.readdir(chaptersDir)).filter(f => f.startsWith('chapter-') && f.endsWith('.htm'));
  const zuordnungen: KapitelZuordnung[] = [];

  for (const file of files) {
    const html = await fs.readFile(path.join(chaptersDir, file), 'utf-8');
    const $ = cheerio.load(html);

    const h1 = $('div.Chapter > h1').first();
    if (!h1.length) {
      console.warn(`⚠️ Kein Kapitel <h1> in ${file}`);
      continue;
    }

    const fullText = h1.text().replace(/\s+/g, ' ').trim(); // alles flachziehen
const match = fullText.match(/Kapitel\s*([IVXLCDM]+)\s*([^()]+)\((\w{3})[–-](\w{3})\)/);

    if (match) {
      const [, kapitel, titel, codeVon, codeBis] = match;
      zuordnungen.push({ kapitel, titel, codeVon, codeBis });
    } else {
      console.warn(`⚠️ Unvollständiger Textinhalt in ${file}: ${fullText}`);
    }
  }

  return zuordnungen;
}
