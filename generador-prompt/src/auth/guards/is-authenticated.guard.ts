import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { AuthStatus } from '../interfaces/Auth.Response'

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  await authStore.checkAuthStatus()

  if (authStore.authStatus === AuthStatus.NoAutorizado && to.name !== 'about') {
    next({ name: 'home' }) // Redirige solo si no está en home
  } else {
    next() // Permite la navegación
  }
}

export default isAuthenticatedGuard
