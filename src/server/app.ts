import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';

export default (opts?: FastifyServerOptions) => {
  const fastify = Fastify(opts);

  fastify.register(helmet, { contentSecurityPolicy: false });
  fastify.register(cors);

  fastify.get('/', async (request, reply) => {
    request.log.warn('warning', new Date());
    return { hello: 'world' };
  });

  return fastify;
};
