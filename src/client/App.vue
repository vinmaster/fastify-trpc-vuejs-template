<script setup lang="ts">
</script>

<template>
  <nav class="navbar">
    <ul class="navbar-brand">
      <li class="navbar-item">
        <router-link to="/">
          <img alt="Vue Logo" src="./assets/logo.png" width="40" />
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