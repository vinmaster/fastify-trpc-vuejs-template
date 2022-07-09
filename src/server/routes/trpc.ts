import { Context } from '../lib/context';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { Subscription, TRPCError } from '@trpc/server';
import { User, users, UserSchema } from '../data/data';
// import { wsRoutes } from './ws';

const createRouter = () => trpc.router<Context>();

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
    async resolve({ input }) {
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
    async resolve({ input }) {
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

const wsRoutes = createRouter()
  .subscription('randomNumber', {
    resolve() {
      return new Subscription<{ randomNumber: number }>(emit => {
        const timer = setInterval(() => {
          emit.data({ randomNumber: Math.random() });
        }, 10000);
        return () => {
          console.log('ws closed');
          clearInterval(timer);
        };
      });
    },
  })
  .subscription('date', {
    resolve() {
      return new Subscription<{ date: Date }>(emit => {
        emit.data({ date: new Date() });
        return () => {
          console.log('date closed');
        };
      });
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
  .merge('admin.', adminRoutes)
  .merge('ws.', wsRoutes);

// export type definition of API
export type AppRouter = typeof appRouter;
