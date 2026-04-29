import { z } from 'zod';

export const RegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
  displayName: z.string().min(1).max(100).nullable().default(null),
});

export type RegistrationBoby = z.infer<typeof RegistrationSchema>;
