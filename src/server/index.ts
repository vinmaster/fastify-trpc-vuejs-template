import fastify from './app';
import logger from './lib/logger';

process.on('unhandledRejection', e => {
  console.error(e);
  process.exit(1);
});

async function startServer() {
  try {
    const app = fastify({
      logger,
      pluginTimeout: 50000,
      bodyLimit: 15485760,
    });
    await app.ready();

    const PORT = parseInt(process.env.PORT || '8000', 10);

    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server started on 0.0.0.0:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
