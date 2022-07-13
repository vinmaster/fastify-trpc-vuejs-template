import { SocketStream } from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import { Subscription } from '@trpc/server';
import { createRouter } from '../lib/context';

// export function wsRoutes(fastify: FastifyInstance, opts, done) {
//   fastify.get('/', { websocket: true }, async (connection: SocketStream, request) => {
//     connection.socket.on('connect');
//   });

//   done();
// }

export const wsRoutes = createRouter()
  .subscription('randomNumber', {
    resolve() {
      return new Subscription<{ randomNumber: number }>(emit => {
        const timer = setInterval(() => {
          emit.data({ randomNumber: Math.random() });
        }, 10000);
        return () => {
          console.log('ws closed');
          clearInterval(timer);
        };
      });
    },
  })
  .subscription('date', {
    resolve({ ctx }) {
      return new Subscription<{ date: Date }>(emit => {
        console.log('req id', ctx.req.id, new Date());
        emit.data({ date: new Date() });
        return () => {
          console.log('date closed');
        };
      });
    },
  });
