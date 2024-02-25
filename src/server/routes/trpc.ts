import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { TRPCError } from '@trpc/server';
import { User, users, UserSchema } from '../data/data';
import { Context } from '../lib/context';
// import { wsRoutes } from './ws';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const adminProcedure = t.procedure.use(async ({ ctx, next, meta }) => {
  // if (meta?.auth && !ctx.user) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED', cause: 'cause' });
  // }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

const userRouter = t.router({
  getUserByUsername: t.procedure.input(z.string()).query(({ input }) => {
    return users.get(input);
  }),
  createUser: t.procedure.input(UserSchema).mutation(({ input, ctx }) => {
    if (!input.username) throw new TRPCError({ code: 'BAD_REQUEST' });
    const user: User = input as User;
    users.set(user.username, user);
    return user;
  }),
  login: t.procedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      let user = users.get(input.username);
      if (!user || user.password != input.password) throw new TRPCError({ code: 'BAD_REQUEST' });

      user.lastLoggedInAt = new Date();
      return 'success';
    }),
});

const adminRouter = t.router({
  protected: adminProcedure.query(() => 'ok'),
});

export const appRouter = t.router({
  user: userRouter,
  admin: adminRouter,
});
// .middleware(async ({ path, type, next }) => {
//   let start = Date.now();
//   let result = await next();
//   let duration = Date.now() - start;
//   result.ok
//     ? console.log('OK', { path, type, duration })
//     : console.log('Non-OK', { path, type, duration });

//   return result;
// })

export type AppRouter = typeof appRouter;
