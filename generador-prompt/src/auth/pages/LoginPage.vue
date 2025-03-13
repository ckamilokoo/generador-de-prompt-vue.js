<template>
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <form @submit.prevent="onLogin">
    <!-- Username Input -->
    <div class="mb-4">
      <label for="username" class="block text-gray-600">Username</label>
      <input
        v-model="myForm.email"
        ref="usurnameInputRef"
        type="text"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        v-model="myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">
      <input
        v-model="myForm.rememberMe"
        type="checkbox"
        id="remember"
        name="remember"
        class="text-blue-500"
      />
      <label for="remember" class="text-gray-600 ml-2">Recordar usuario</label>
    </div>
    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline"> Olvidaste la contraseña?</a>
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center gap-2"
      :disabled="isLoading"
    >
      <svg
        v-if="isLoading"
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {{ isLoading ? 'Procesando...' : 'Ingresar' }}
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center space-y-4">
    <RouterLink
      :to="{ name: 'registro' }"
      class="bg-orange-500 hover:bg-orange-700 text-white font-semibold rounded-md py-2 px-4 w-full block"
    >
      Crear cuenta aquí
    </RouterLink>

    <RouterLink
      :to="{ name: 'home' }"
      class="bg-green-400 hover:bg-green-600 text-white font-semibold rounded-md py-2 px-1 w-full block"
    >
      Home
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect } from 'vue'

import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toastification'
const isLoading = ref(false)

const usurnameInputRef = ref<HTMLInputElement | null>(null)

const passwordInputRef = ref<HTMLInputElement | null>(null)
const toast = useToast()

const authStore = useAuthStore()

const myForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const onLogin = async () => {
  if (myForm.email === '') {
    return usurnameInputRef.value?.focus()
  }

  if (myForm.password.length < 6) {
    return passwordInputRef.value?.focus()
  }

  if (myForm.rememberMe) {
    localStorage.setItem('username', myForm.email)
  } else {
    localStorage.removeItem('username')
  }
  try {
    isLoading.value = true // Activar carga
    const ok = await authStore.login(myForm.email, myForm.password)

    if (ok) return

    toast.error('Usuario/contraseña no son correctos')
    console.log({ ok })
  } finally {
    isLoading.value = false // Desactivar carga siempre
  }
}

watchEffect(() => {
  const username = localStorage.getItem('username')
  if (username) {
    myForm.email = username
    myForm.rememberMe = true
  }
})
</script>
