<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { client } from '../lib/trpc';

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

    const frodo = await client.mutation('user.createUser', { username: 'Frodo', password: 'password' });
    console.log(frodo);

    const res = await client.query('user.getUserByUsername', 'Frodo');
    console.log(res);
  } catch (error) {
    console.error(error);
  }
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
          <figure><img src="https://placeimg.com/400/225/arch" /></figure>
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