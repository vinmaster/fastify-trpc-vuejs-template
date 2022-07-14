import { appRouter } from '../src/server/routes/trpc';
import { inferMutationInput } from '../src/server/lib/types';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import fastify from '../src/server/app';

let app = fastify();

beforeAll(async () => {
  await app.ready();
});
afterAll(async () => {
  await app.close();
});

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

it('GET /api', async () => {
  let res = await app.inject('/api');
  expect(res.statusCode).eq(200);
  expect(res.json()).deep.eq({ hello: 'world' });
});

it('GET /api/not-found', async () => {
  let app = fastify();
  let res = await app.inject('/api/not-found');
  expect(res.statusCode).eq(404);
  expect(res.json()).deep.eq({ status: 404, error: 'Not Found' });
});
