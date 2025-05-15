import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { parseKapiteldateien, KapitelZuordnung } from './parse-chapters';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blocksDir = path.join(__dirname, '../data/icd10-html');
const outputPath = path.join(__dirname, '../data/icd10.json');

type Icd10Eintrag = {
  code: string;
  titel: string;
  gruppe?: string;
  kapitel?: string;
  kapitelTitel?: string;
  quelle: string;
};

function liegtZwischen(code: string, von: string, bis: string): boolean {
  return code.localeCompare(von) >= 0 && code.localeCompare(bis) <= 0;
}

async function parseHtmlFile(filePath: string): Promise<Icd10Eintrag[]> {
  const html = await fs.readFile(filePath, 'utf-8');
  const $ = cheerio.load(html);
  const eintraege: Icd10Eintrag[] = [];

  $('h5').each((_i, el) => {
    const code = $(el).find('a.code').text().trim();
    const titel = $(el).find('span.label').text().trim();
    if (code && titel) {
      eintraege.push({ code, titel, quelle: path.basename(filePath) });
    }
  });

  return eintraege;
}

async function convertAllBlocks() {
  const files = (await fs.readdir(blocksDir)).filter(f => f.startsWith('block-') && f.endsWith('.htm'));
  const kapitelDaten = await parseKapiteldateien();
  const all: Icd10Eintrag[] = [];

  for (const file of files) {
    const filePath = path.join(blocksDir, file);
    const eintraege = await parseHtmlFile(filePath);

    for (const eintrag of eintraege) {
      const zutreffend = kapitelDaten.find(k =>
        liegtZwischen(eintrag.code, k.codeVon, k.codeBis)
      );

      if (zutreffend) {
        eintrag.kapitel = zutreffend.kapitel;
        eintrag.kapitelTitel = zutreffend.titel;
      }
    }

    all.push(...eintraege);
    console.log(`✅ ${file}: ${eintraege.length} Einträge`);
  }

  await fs.writeFile(outputPath, JSON.stringify(all, null, 2), 'utf-8');
  console.log(`🎉 Insgesamt ${all.length} ICD-10-Einträge gespeichert in ${outputPath}`);
}

convertAllBlocks();
