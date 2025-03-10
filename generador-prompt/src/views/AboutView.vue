<script setup lang="ts">
import Chabot from '../components/HelloWorld.vue'
</script>

<template>
  <HeaderPage />
  <main>
    <Chabot />
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
