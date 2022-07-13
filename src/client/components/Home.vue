<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { client, IS_DEV } from '../lib/trpc';

let socket = new WebSocket(IS_DEV ? `ws://localhost:8000/ws` : `wss://${window.location.host}/ws`);

onMounted(async () => {
  try {
    console.log('mounted');

    socket.onopen = () => {
      console.log('open');
      socket.send(JSON.stringify(new Date()));
    };
    socket.onclose = () => console.log('close');
    socket.onmessage = (e) => {
      console.log('message', e.data);
    };
    socket.onerror = (e) => console.error(e);

    const frodo = await client.mutation('user.createUser', { username: 'Frodo', password: 'password' });
    console.log(frodo);

    const res = await client.query('user.getUserByUsername', 'Frodo');
    console.log(res);
  } catch (error) {
    console.error(error);
  }
});

onUnmounted(() => {
  socket.close();
});

const count = ref(0);
</script>

<template>
  <div class="hero bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Fastify Template</h1>
        <p class="py-6">This is home page.</p>

        <div class="card w-96 bg-base-100 shadow-xl">
          <figure><img src="https://picsum.photos/400/300" /></figure>
          <div class="card-body">
            <h2 class="card-title">Counter Example</h2>
            <p>Click on buttons below</p>
            <div class="card-actions justify-end">
              <button type="button" class="btn btn-primary" @click="count++">count is: {{ count }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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