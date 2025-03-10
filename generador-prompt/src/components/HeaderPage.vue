<template>
  <header class="header">
    <div class="container mx-auto px-4 py-6 flex justify-between items-center">
      <div class="logo-container flex items-center">
        <SparklesIcon class="h-8 w-8 text-purple-400" />
        <h1 class="text-2xl font-bold ml-2 text-white">Prompt Nebula</h1>
      </div>
      <nav>
        <ul class="flex space-x-6">
          <RouterLink
            to="/"
            type="button"
            class="mr-3 hidden border border-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 md:inline-block rounded-lg"
          >
            Inicio
          </RouterLink>
          <RouterLink
            to="/about"
            type="button"
            class="mr-3 hidden border border-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 md:inline-block rounded-lg"
          >
            Chatbot
          </RouterLink>

          <li v-if="!isLoggedIn">
            <RouterLink
              to="auth/login"
              type="button"
              class="mr-3 hidden border border-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 md:inline-block rounded-lg"
            >
              Login
            </RouterLink>
          </li>
          <li v-else>
            <button @click="navigateToApp" class="app-button">Go to App</button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import {
  SparklesIcon,
  UserIcon,
  SendIcon,
  SaveIcon,
  DownloadIcon,
  HomeIcon,
  ClipboardIcon,
  XIcon,
} from 'lucide-vue-next'

import { ref } from 'vue'

// Variables reactivas

const isLoggedIn = ref(false)
const showLoginModal = ref(false)

const loginEmail = ref('')
const loginPassword = ref('')

function login() {
  // Validar credenciales
  if (loginEmail.value && loginPassword.value) {
    isLoggedIn.value = true
    showLoginModal.value = false
  }
}
</script>

<style scoped>
.header {
  backdrop-filter: blur(10px);
  background-color: rgba(10, 11, 26, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
