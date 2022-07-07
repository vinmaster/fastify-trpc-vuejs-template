<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
    <ul class="navbar-brand">
      <li class="navbar-item">
        <router-link to="/">
          Home
        </router-link>
      </li>
    </ul>
  </nav>
  <router-view></router-view>
</template>

<style>
#app {
  height: 100%;
}
</style>