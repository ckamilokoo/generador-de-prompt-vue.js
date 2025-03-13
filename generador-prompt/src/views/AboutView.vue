<script setup lang="ts">
import Chabot from '../components/ChatbotInterface.vue'
import Chabot_v2 from '../components/ChatbotInterface_v2.vue'
</script>

<template>
  <main>
    <Chabot_v2 />
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
