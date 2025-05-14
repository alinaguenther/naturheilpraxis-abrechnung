import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const icd10Codes = sqliteTable('icd10_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  text: text('text').notNull(),
  category: text('category'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
});