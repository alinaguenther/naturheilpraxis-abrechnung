import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { parseKapiteldateien, KapitelZuordnung } from './parse-chapters.js';
import { Icd10Eintrag } from '../types/icd10.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blocksDir = path.join(__dirname, '../data/icd10-html');
const outputPath = path.join(__dirname, '../data/icd10.json');


function generateId(code: string, titel: string) {
  return crypto.createHash('sha256').update(`${code}|${titel}`).digest('hex');
}

function liegtZwischen(code: string, von: string, bis: string): boolean {
  return code.localeCompare(von) >= 0 && code.localeCompare(bis) <= 0;
}

async function parseHtmlFile(filePath: string): Promise<Omit<Icd10Eintrag, 'id' | 'kapitel' | 'kapitelTitel'>[]> {
  const html = await fs.readFile(filePath, 'utf-8');
  const $ = cheerio.load(html);
  const eintraege: Omit<Icd10Eintrag, 'id' | 'kapitel' | 'kapitelTitel'>[] = [];

  $('h5').each((_i, el) => {
    const code = $(el).find('a.code').text().trim();
    const titel = $(el).find('span.label').text().trim();
    if (code && titel) {
      eintraege.push({ code, titel });
    }
  });

  return eintraege;
}

async function convertAllBlocks() {
  const files = (await fs.readdir(blocksDir)).filter(f => f.startsWith('block-') && f.endsWith('.htm'));
  const kapitelDaten = await parseKapiteldateien();
  const existing: Record<string, Icd10Eintrag> = {};

  try {
    const prev = await fs.readFile(outputPath, 'utf-8');
    JSON.parse(prev).forEach((eintrag: Icd10Eintrag) => {
      if (eintrag.id !== undefined) {
        existing[eintrag.id] = eintrag;
      }
    });
  } catch {
    console.log('📂 Keine bestehende icd10.json gefunden. Es wird eine neue erstellt.');
  }

  const all: Icd10Eintrag[] = [];

  for (const file of files) {
    const filePath = path.join(blocksDir, file);
    const eintraege = await parseHtmlFile(filePath);

    for (const e of eintraege) {
      const id = generateId(e.code, e.titel);
      const zutreffend = kapitelDaten.find((k: KapitelZuordnung) =>
        liegtZwischen(e.code, k.codeVon, k.codeBis)
      );

      const neuerEintrag: Icd10Eintrag = {
        ...e,
        id,
        kapitel: zutreffend?.kapitel,
        kapitelTitel: zutreffend?.titel,
      };

      const alt = existing[id];
      const gleich = alt &&
        alt.titel === neuerEintrag.titel &&
        alt.kapitel === neuerEintrag.kapitel &&
        alt.kapitelTitel === neuerEintrag.kapitelTitel;

      if (!gleich) {
        all.push(neuerEintrag);
      } else {
        all.push(alt); // identisch, alten Eintrag übernehmen
      }
    }

    console.log(`✅ ${file}: ${eintraege.length} Einträge`);
  }

  await fs.writeFile(outputPath, JSON.stringify(all, null, 2), 'utf-8');
  console.log(`🎉 Insgesamt ${all.length} ICD-10-Einträge gespeichert in ${outputPath}`);
}

convertAllBlocks();
