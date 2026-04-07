import { z } from 'zod';

export const RegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

export type RegistrationBoby = z.infer<typeof RegistrationSchema>;
