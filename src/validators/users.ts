import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(5).max(20),
});
