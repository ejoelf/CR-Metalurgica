import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'La confirmación no coincide con la nueva contraseña',
    path: ['confirmPassword'],
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
