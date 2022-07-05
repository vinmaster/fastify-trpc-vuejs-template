<script setup lang="ts">
import { ref } from 'vue'
import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from '../../server/router';

const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:8000/trpc',
});

const bilbo = await client.query('getUserById', 'id_bilbo');
console.log(bilbo);
// => { id: 'id_bilbo', name: 'Bilbo' };

const frodo = await client.mutation('createUser', { name: 'Frodo' });
console.log(frodo);
// => { id: 'id_frodo', name: 'Frodo' };

const count = ref(0)
</script>

<template>
  <h1 class="has-text-centered is-size-1">Express Vuejs Template</h1>

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