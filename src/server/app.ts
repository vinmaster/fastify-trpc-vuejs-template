import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './context';
import { appRouter } from './router';

export default (opts?: FastifyServerOptions) => {
  const fastify = Fastify(opts);

  // fastify.register(helmet, { contentSecurityPolicy: false });
  fastify.register(helmet);
  fastify.register(cors);
  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });
  // fastify.register(ws);

  fastify.get('/', async (request, reply) => {
    // request.log.warn('warning', new Date());
    return { hello: 'world' };
  });

  return fastify;
};
