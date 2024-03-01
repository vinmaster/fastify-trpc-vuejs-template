<script setup lang="ts">
import { ref } from 'vue';
import { client } from '../lib/trpc';
import { HttpClient } from '../lib/HttpClient';

async function hello() {
  let res = await HttpClient.get<{ hello: string; }>('/api');
  console.log(res.hello);
}

async function error() {
  try {
    let res = await HttpClient.get('/api/error');
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

async function fail() {
  try {
    let res = await HttpClient.post('/api/fail', { payload: { fail: true } });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

async function auth() {
  try {
    let res = await HttpClient.post('/api/auth', { payload: { fail: true } });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

async function echo() {
  let res = await HttpClient.post<{ date: Date; }>('/api/echo', { payload: { date: new Date() } });
  console.log(res);
}

</script>

<template>
  <div class="font-sans min-h-screen antialiased pt-24 pb-5 text-white">
    <div class="flex flex-col justify-center sm:w-96 sm:m-auto mx-5 mb-5 space-y-8">
      <h1 class="font-bold text-center text-4xl text-white">Test Page</h1>

      <button type="button" @click="hello"
        class="bg-blue-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">
        Hello</button>
      <button type="button" @click="error"
        class="bg-red-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">
        Error</button>
      <button type="button" @click="fail"
        class="bg-orange-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">
        Fail</button>
      <button type="button" @click="auth"
        class="bg-orange-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">
        Auth fail</button>
      <button type="button" @click="echo"
        class="bg-yellow-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">
        Echo</button>
    </div>
  </div>
</template>

<style scoped></style>
