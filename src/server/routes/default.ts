import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function appErrorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  console.error(error);
  let status = error.statusCode ?? 500;

  return reply.status(status).send({
    status,
    error: 'Internal Server Error',
  });
}

export async function appNotFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  if (request.raw.url && request.raw.url.startsWith('/api')) {
    return reply.status(404).send({
      status: 404,
      error: 'Not Found',
    });
  }

  return reply.status(200).sendFile('index.html');
}
