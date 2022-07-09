import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string().min(3),
  password: z.string().max(1000),
  name: z.string().max(100).optional(),
  lastLoggedInAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const users: Map<string, User> = new Map([
  ['admin', { username: 'admin', password: 'password', name: 'Admin' }],
]);
