import { copyFile } from 'fs/promises';
import { resolve } from 'path';

async function setup() {
  try {
    // Copy .env.example to .env.local if it doesn't exist
    await copyFile(
      resolve(process.cwd(), '.env.example'),
      resolve(process.cwd(), '.env.local'),
      0
    ).catch(() => console.log('.env.local already exists'));

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup();