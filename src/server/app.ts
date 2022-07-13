import path from 'path';
import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import env from '@fastify/env';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './lib/context';
import { appRouter } from './routes/trpc';
import { apiRoutes } from './routes/api';
import { appErrorHandler, appNotFoundHandler } from './routes/default';
import { wsRoutes } from './routes/ws';

const envOptions = {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['JWT_SECRET'],
    properties: {
      JWT_SECRET: { type: 'string' },
    },
  },
};

export default (opts?: FastifyServerOptions) => {
  const fastify = Fastify(opts);

  fastify.register(env, envOptions);
  // fastify.register(helmet, { contentSecurityPolicy: false });
  fastify.register(helmet);
  fastify.register(cors);
  fastify.register(staticFiles, { root: path.join(__dirname, 'public') });
  fastify.register(ws, { options: { maxPayload: 1048576 } });
  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });
  fastify.register(apiRoutes, { prefix: 'api' });
  fastify.register(wsRoutes, { prefix: 'ws' });
  fastify.setErrorHandler(appErrorHandler);
  fastify.setNotFoundHandler(appNotFoundHandler);

  return fastify;
};
