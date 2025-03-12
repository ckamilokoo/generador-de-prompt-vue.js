<script setup lang="ts">
import FooterPage from './components/FooterPage.vue'
import HeaderPage from './components/HeaderPage.vue'

const route = useRoute()

console.log('Ruta actual:', route.path)
console.log('Nombre de la ruta:', route.name)
console.log('Query parameters:', route.query)
console.log('Params:', route.params)

import { useAuthStore } from './auth/stores/auth.store'
import { AuthStatus } from './auth/interfaces/Auth.Response'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()

authStore.$subscribe(
  (_, state) => {
    if (state.authStatus === AuthStatus.Cheking) {
      authStore.checkAuthStatus()
      console.log(state.authStatus)
      return
    }
    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Autorizado) {
      router.replace({ name: 'about' })
      return
    }

    if (route.path.includes('/about') && state.authStatus === AuthStatus.NoAutorizado) {
      router.replace({ name: 'login' })
      return
    }
    console.log(state.authStatus)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div v-if="route.path == '/auth/login'"><RouterView /></div>
  <div v-else>
    <HeaderPage />
    <RouterView />
    <FooterPage />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
