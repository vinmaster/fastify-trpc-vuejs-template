<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createTRPCClient } from '@trpc/client';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import superjson from 'superjson';
import type { AppRouter } from '../../server/routes/trpc';

const url = import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin;
const wsClient = createWSClient({
  url: `ws://localhost:8000/trpc`,
});
const client = createTRPCClient<AppRouter>({
  url: `${url}/trpc`,
  transformer: superjson,
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});

onMounted(async () => {
  try {
    console.log('mounted');

    client.subscription('ws.date', undefined, {
      onDone() {
        console.log('onDone');
      },
      onNext(result) {
        if (result.type === 'data') {
          console.log('onNext', result.data);
        } else {
          console.log('onNext', result);
        }
      }, onError(error) {
        console.error('onError', error);
      }
    });

    const frodo = await client.mutation('user.createUser', { name: 'Frodo' });
    console.log(frodo);

    const res = await client.query('user.getUserByName', 'Frodo');
    console.log(res);
  } catch (error) {
    console.error(error);
  }
});

const count = ref(0);
</script>

<template>
  <h1 class="has-text-centered is-size-1">Fastify Template</h1>

  <div class="container is-flex is-justify-content-center mb-2">
    <div class="mr-2">Counter</div>
    <button type="button" @click="count++">count is: {{ count }}</button>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>