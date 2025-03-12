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
            v-if="!authStore.isAutenticado"
            to="auth/login"
            type="button"
            class="block border border-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
            @click="isMobileMenuOpen = false"
          >
            Login
          </RouterLink>

          <li v-if="authStore.isAutenticado">
            <button
              @click="authStore.logout()"
              type="button"
              class="mr-3 hidden bg-blue-700 py-1.5 px-6 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:mr-0 md:inline-block rounded-lg"
            >
              Cerrar sesión
            </button>
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
        <RouterLink
          v-if="!authStore.isAutenticado"
          to="auth/login"
          type="button"
          class="block border bg-blue-700 border-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
          @click="isMobileMenuOpen = false"
        >
          Login
        </RouterLink>

        <li v-if="authStore.isAutenticado">
          <button
            @click="authStore.logout()"
            type="button"
            class="block border bg-blue-700 py-2 px-4 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { SparklesIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/auth/stores/auth.store'

const isLoggedIn = ref(false)
const isMobileMenuOpen = ref(false)
const authStore = useAuthStore()

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
