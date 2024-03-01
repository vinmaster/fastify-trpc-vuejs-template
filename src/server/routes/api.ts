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

  fastify.post('/echo', async (request, reply) => {
    return request.body;
  });

  fastify.post('/fail', async (request, reply) => {
    let body = request.body as any;
    if (body.fail) {
      return reply.code(400).send(body);
    } else {
      return body;
    }
  });

  fastify.post('/auth', async (request, reply) => {
    let body = request.body as any;
    if (body.fail) {
      return reply.code(401).send(body);
    } else {
      return body;
    }
  });

  done();
}
