<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createTRPCClient } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../../server/router';

const url = import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin;
const client = createTRPCClient<AppRouter>({
  url: `${url}/trpc`,
  transformer: superjson,
});

onMounted(async () => {
  try {
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