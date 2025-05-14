import { db } from './index';
import { icd10Codes } from './schema';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

async function seedDatabase() {
  try {
    const filePath = resolve(process.cwd(), 'src', 'data', 'icd10.json');
    const data = await readFile(filePath, 'utf-8');
    const codes = JSON.parse(data);

    console.log('Seeding database...');
    
    await db.insert(icd10Codes)
      .values(codes)
      .onConflictDoNothing({ target: icd10Codes.code });
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();