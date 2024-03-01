<script setup lang="ts">
import { ref } from 'vue';
import { client } from '../lib/trpc';
import { HttpClient } from '../lib/HttpClient';

const username = ref('');
const password = ref('');

async function onSubmit() {
  console.log('submit');
  let res = await client.user.login.mutate({ username: username.value, password: password.value });
  console.log('res', res);
}

</script>

<template>
  <div class="font-sans min-h-screen antialiased pt-24 pb-5 text-white">
    <div class="flex flex-col justify-center sm:w-96 sm:m-auto mx-5 mb-5 space-y-8">
      <h1 class="font-bold text-center text-4xl text-yellow-500">Login<span class="text-blue-500">Page</span></h1>

      <form @submit.prevent="onSubmit">
        <div class="flex flex-col bg-gray-500 p-10 rounded-lg shadow space-y-6">
          <h1 class="font-bold text-xl text-center">Sign in to your account</h1>

          <div class="flex flex-col space-y-1">
            <input type="text" name="username" id="username"
              class="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow"
              placeholder="Username" v-model="username" />
          </div>

          <div class="flex flex-col space-y-1">
            <input type="password" name="password" id="password"
              class="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow"
              placeholder="Password" v-model="password" />
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center">
            <!-- <a href="#" class="inline-block text-blue-500 hover:text-blue-800 hover:underline">Forgot your password?</a> -->
            <button type="submit"
              class="bg-blue-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">Log
              In</button>
          </div>
        </div>
      </form>

    </div>
  </div>
</template>

<style scoped></style>
