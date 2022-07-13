<script setup lang="ts">
</script>

<template>
  <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
      <a href="#" class="flex items-center">
        <img src="./assets/favicon.png" class="mr-3 h-6 sm:h-9" alt="Logo" />
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">App</span>
      </a>
      <div class="flex items-center lg:order-2">
        <router-link to="/"
          class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
          Home
        </router-link>
        <router-link to="/login"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Login
        </router-link>
      </div>
    </div>
  </nav>

  <router-view></router-view>
</template>

<style>
</style>