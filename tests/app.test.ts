import { appRouter } from '../src/server/routes/trpc';
import { inferMutationInput } from '../src/server/lib/types';
import { describe, it, expect } from 'vitest';

it('add and get user', async () => {
  const caller = appRouter.createCaller({} as any);

  const input: inferMutationInput<'user.createUser'> = {
    username: 'test name',
    password: 'test pass',
  };
  const user = await caller.mutation('user.createUser', input);
  const byId = await caller.query('user.getUserByUsername', input.username);

  expect(byId).toMatchObject(input);
});
