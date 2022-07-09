import path from 'path';
import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import env from '@fastify/env';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './context';
import { apiRoutes, appRouter } from './router';

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
  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });
  // fastify.register(ws);
  fastify.register(apiRoutes, { prefix: 'api' });

  fastify.setNotFoundHandler(async (request, reply) => {
    if (request.raw.url && request.raw.url.startsWith('/api')) {
      return reply.status(404).send({
        status: 404,
        error: 'Not Found',
      });
    }

    return reply.status(200).sendFile('index.html');
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    console.error(error);
    let status = error.statusCode ?? 500;
    reply.status(status).send({
      status,
      error: 'Internal Server Error',
    });
  });

  // fastify.get('/', async (request, reply) => {
  //   // request.log.warn('warning', new Date());
  //   // return { hello: 'world' };
  //   return reply.sendFile('index.html');
  // });
  fastify.get('/error', async (request, reply) => {
    throw new Error('test');
    return { hello: 'world' };
  });

  return fastify;
};
