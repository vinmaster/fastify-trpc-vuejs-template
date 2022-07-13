import { SocketStream } from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import * as WebSocket from 'ws';

let maxId = 1;

export function wsRoutes(fastify: FastifyInstance, opts, done) {
  function getClients(): Set<WebSocket> {
    return fastify.websocketServer.clients;
  }

  function broadcast(message) {
    for (let client of getClients()) {
      client.send(JSON.stringify(message));
    }
  }

  fastify.get('/', { websocket: true }, async (connection: SocketStream, request) => {
    connection.socket.id = maxId++;
    console.log('connected', connection.socket.id);
    // connection.socket.on('connect', () => {
    //   console.log('connect', fastify.websocketServer.clients);
    // });

    connection.socket.on('close', () => {
      console.log(
        'close',
        connection.socket.id,
        [...getClients()].map(c => c.id)
      );
    });

    connection.socket.on('message', message => {
      message = JSON.parse(message.toString());
      console.log('message', message);
      connection.socket.send(message);
    });
  });

  done();
}

// export const wsRoutes = createRouter()
//   .subscription('randomNumber', {
//     resolve() {
//       return new Subscription<{ randomNumber: number }>(emit => {
//         const timer = setInterval(() => {
//           emit.data({ randomNumber: Math.random() });
//         }, 10000);
//         return () => {
//           console.log('ws closed');
//           clearInterval(timer);
//         };
//       });
//     },
//   })
//   .subscription('date', {
//     resolve({ ctx }) {
//       return new Subscription<{ date: Date }>(emit => {
//         console.log('req id', ctx.req.id, new Date());
//         emit.data({ date: new Date() });
//         return () => {
//           console.log('date closed');
//         };
//       });
//     },
//   });
