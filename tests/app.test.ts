import { appRouter } from '../src/server/router';
import { inferMutationInput } from '../src/server/types';
import { describe, it, expect } from 'vitest';

it('add and get user', async () => {
  const caller = appRouter.createCaller({});

  const input: inferMutationInput<'createUser'> = {
    name: 'test name',
  };
  const user = await caller.mutation('createUser', input);
  const byId = await caller.query('getUserByName', input.name);

  expect(byId).toMatchObject(input);
});
