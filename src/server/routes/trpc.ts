import { createRouter } from '../lib/context';
import { z } from 'zod';
import superjson from 'superjson';
import { TRPCError } from '@trpc/server';
import { User, users, UserSchema } from '../data/data';
// import { wsRoutes } from './ws';

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

const createProtectedRouter = () => createRouter().middleware(authMiddleware);

const userRoutes = createRouter()
  .query('getUserByUsername', {
    input: z.string(),
    async resolve({ input }) {
      return users[input];
    },
  })
  .mutation('createUser', {
    input: UserSchema,
    async resolve({ input, ctx }) {
      if (!input.username) throw new TRPCError({ code: 'BAD_REQUEST' });
      const user: User = input as User;
      users[user.username] = user;
      return user;
    },
  })
  .mutation('login', {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ input, ctx }) {
      let user = users.get(input.username);
      if (!user || user.password != input.password) throw new TRPCError({ code: 'BAD_REQUEST' });

      user.lastLoggedInAt = new Date();
      return 'success';
    },
  });

const adminRoutes = createProtectedRouter().query('protected', {
  async resolve(req) {
    return 'ok';
  },
});

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ path, type, next }) => {
    let start = Date.now();
    let result = await next();
    let duration = Date.now() - start;
    result.ok
      ? console.log('OK', { path, type, duration })
      : console.log('Non-OK', { path, type, duration });

    return result;
  })
  .merge('user.', userRoutes)
  .merge('admin.', adminRoutes);

export type AppRouter = typeof appRouter;
