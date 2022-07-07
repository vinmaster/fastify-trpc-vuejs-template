import { Context } from './context';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { TRPCError } from '@trpc/server';

type User = {
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};

const createRouter = () => {
  return trpc
    .router<Context>()
    .middleware(async ({ path, type, next }) => {
      let start = Date.now();
      let result = await next();
      let duration = Date.now() - start;
      result.ok
        ? console.log('OK', { path, type, duration })
        : console.log('Non-OK', { path, type, duration });

      return result;
    })
    .transformer(superjson);
};

const authMiddleware = async ({ ctx, next, meta }: any) => {
  if (meta?.auth && !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', cause: 'cause' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
};

const userRoutes = createRouter()
  .query('getUserByName', {
    input: z.string(),
    async resolve({ input }) {
      return users[input];
    },
  })
  .mutation('createUser', {
    input: z.object({
      name: z.string().min(3),
      bio: z.string().max(142).optional(),
    }),
    async resolve({ input }) {
      if (!input.name) throw new TRPCError({ code: 'BAD_REQUEST', cause: 'cause' });
      const user: User = input as User;
      users[user.name] = user;
      return user;
    },
  });

const adminRoutes = createRouter()
  .middleware(authMiddleware)
  .query('protected', {
    async resolve(req) {
      return 'ok';
    },
  });

export const appRouter = createRouter().merge('user.', userRoutes).merge('admin.', adminRoutes);

// export type definition of API
export type AppRouter = typeof appRouter;
