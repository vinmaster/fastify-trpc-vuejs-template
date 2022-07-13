import { FastifyInstance } from 'fastify';

export function apiRoutes(fastify: FastifyInstance, opts, done) {
  fastify.get('/date', function (request, reply) {
    reply.send({ date: new Date() });
  });

  fastify.get('/', async (request, reply) => {
    // request.log.warn('warning', new Date());
    return { hello: 'world' };
  });

  fastify.get('/info', async (request, reply) => {
    return { id: request.id };
  });

  fastify.get('/error', async (request, reply) => {
    throw new Error('test');
  });
  done();
}
