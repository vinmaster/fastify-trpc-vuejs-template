import * as trpc from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: 'anonymous' };
  if (req.headers.authorization) {
    return { req, res, user: { name: req.headers.authorization } };
  }

  return { req, res, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
