import { SocketStream } from '@fastify/websocket';
import { Subscription } from '@trpc/server';
import { FastifyInstance } from 'fastify';
// import { createRouter } from './trpc';

// export function wsRoutes(fastify: FastifyInstance, opts, done) {
//   fastify.get('/', { websocket: true }, async (connection: SocketStream, request) => {
//     connection.socket.on('connect');
//   });

//   done();
// }
