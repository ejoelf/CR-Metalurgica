import { z } from 'zod';

const userBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  roleId: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const createUserSchema = z.object({
  body: userBody.extend({ password: z.string().min(6) }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateUserSchema = z.object({
  body: userBody.partial(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
});
