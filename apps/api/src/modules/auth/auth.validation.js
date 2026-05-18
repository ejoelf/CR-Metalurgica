import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().trim().min(1, 'Usuario requerido').optional(),
    email: z.string().trim().min(1).optional(),
    password: z.string().min(1, 'Contraseña requerida'),
  }).refine((data) => data.identifier || data.email, {
    message: 'Usuario requerido',
    path: ['identifier'],
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
    name: z.string().trim().min(1).max(120),
    username: z.string().trim().min(1, 'Usuario requerido').max(80, 'Usuario demasiado largo').optional(),
    email: z.string().trim().email(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Contraseña actual requerida'),
    newPassword: z.string().min(1, 'Nueva contraseña requerida').max(128),
    confirmPassword: z.string().min(1, 'Confirmación requerida').max(128),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'La confirmación no coincide con la nueva contraseña',
    path: ['confirmPassword'],
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
