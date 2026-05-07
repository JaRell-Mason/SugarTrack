import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(5).max(20),
  displayName: z.string().min(1).max(100).nullable().default(null),
});

export const UpdateEmailSchema = z.object({
  email: z.string().email(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(5).max(20),
});
