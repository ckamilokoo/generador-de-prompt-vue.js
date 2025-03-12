<template>
  <header class="header">
    <div class="container mx-auto px-4 py-6 flex justify-between items-center">
      <div class="logo-container flex items-center">
        <SparklesIcon class="h-8 w-8 text-purple-400" />
        <h1 class="text-2xl font-bold ml-2 text-white">Prompt Nebula</h1>
      </div>
      <!-- Botón de menú móvil: visible solo en pantallas pequeñas -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="md:hidden text-white focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <!-- Navegación para pantallas grandes -->
      <nav class="hidden md:block">
        <ul class="flex space-x-6">
          <RouterLink
            to="/"
            type="button"
            class="mr-3 border border-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
          >
            Inicio
          </RouterLink>
          <RouterLink
            to="/about"
            type="button"
            class="mr-3 border border-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
          >
            Chatbot
          </RouterLink>
          <li v-if="!isLoggedIn">
            <RouterLink
              to="auth/login"
              type="button"
              class="mr-3 border border-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
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
    <!-- Menú móvil: se muestra solo en pantallas pequeñas -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-gray-800">
      <ul class="px-4 py-2 space-y-2">
        <li>
          <RouterLink
            to="/"
            type="button"
            class="block border border-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
            @click="isMobileMenuOpen = false"
          >
            Inicio
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/about"
            type="button"
            class="block border border-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
            @click="isMobileMenuOpen = false"
          >
            Chatbot
          </RouterLink>
        </li>
        <li v-if="!isLoggedIn">
          <RouterLink
            to="auth/login"
            type="button"
            class="block border border-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
            @click="isMobileMenuOpen = false"
          >
            Login
          </RouterLink>
        </li>
        <li v-else>
          <button
            @click="(navigateToApp(), (isMobileMenuOpen = false))"
            class="block w-full border border-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
          >
            Go to App
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { SparklesIcon } from 'lucide-vue-next'

const isLoggedIn = ref(false)
const isMobileMenuOpen = ref(false)

function navigateToApp() {
  // Lógica para navegar a la aplicación
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
