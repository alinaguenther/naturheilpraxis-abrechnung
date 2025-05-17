import { z } from 'zod';

export const KarteieintragSchema = z.object({
  id: z.string().uuid(),
  datum: z.string().datetime(), // ISO-Format vorausgesetzt
  notiz: z.string().min(1, 'Notiz darf nicht leer sein'),
  diagnosen: z.array(z.string()) // Nur die ICD-10 IDs
});

export type ValidatedKarteieintrag = z.infer<typeof KarteieintragSchema>;
