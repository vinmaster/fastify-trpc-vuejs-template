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
