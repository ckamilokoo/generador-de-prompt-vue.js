import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { AuthStatus, type User } from '../interfaces/Auth.Response'
import { loginAction } from '../actions/login.actions'
import { registroAction } from '../actions/register.actions'
import { useLocalStorage } from '@vueuse/core'
import { checkAuthActions } from '../actions/check-auth.actions'
import { Nuevo_MensajeActions } from '@/generar_prompt/mensaje.actions'
import { Obtener_PromptActions, Nuevo_PromptActions } from '@/generar_prompt/prompt.actions'

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Cheking)
  const user = ref<User | undefined>()
  const token = ref(useLocalStorage('token', ''))
  const mensajes = ref<string | undefined>('')
  const prompt_guardados = ref({})
  const prompt_nuevo = ref({})

  const mensaje = async (mensaje: string, thread_id: string) => {
    try {
      const MensajeResp = await Nuevo_MensajeActions(mensaje, thread_id)

      mensajes.value = MensajeResp.respuesta

      console.log(mensajes)
      return mensajes
    } catch (error) {
      return error
    }
  }

  const crearPrompt = async (username: string) => {
    try {
      const MensajeResp = await Nuevo_PromptActions(username, '', [])
      console.log('dentro de piña', MensajeResp)
      prompt_nuevo.value = {
        id: MensajeResp.id,
        prompt: MensajeResp.prompt,
        mensajes: MensajeResp.mensaje,
      }

      console.log('id del prompt nuevo:', prompt_nuevo.value)
      return prompt_nuevo
    } catch (error) {
      return error
    }
  }

  const obtener_prompt = async (username: string) => {
    try {
      console.log(' dentro obtener_prompt', username)
      const MensajeResp = await Obtener_PromptActions(username)

      prompt_guardados.value = MensajeResp.conversaciones

      console.log('obtener_prompt prompt guardado', prompt_guardados.value)
      return prompt_guardados
    } catch (error) {
      return error
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const loginResp = await loginAction(username, password)
      if (!loginResp.ok) {
        logout()
        return false
      }

      user.value = loginResp.user

      token.value = loginResp.token
      authStatus.value = AuthStatus.Autorizado
      return true
    } catch (error) {
      return logout()
    }
  }

  const registro = async (username: string, password: string) => {
    try {
      const RegistroResp = await registroAction(username, password)
      if (!RegistroResp.ok) {
        logout()
        return false
      }

      user.value = RegistroResp.user
      token.value = RegistroResp.token
      authStatus.value = AuthStatus.Autorizado
      return true
    } catch (error) {
      return { ok: false, mensaje: 'Error al registrar al usuario' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    authStatus.value = AuthStatus.NoAutorizado
    user.value = undefined
    token.value = ''
    return false
  }

  //const admin =

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthActions()

      if (!statusResp.ok) {
        logout()
        return false
      }

      user.value = statusResp.user

      token.value = statusResp.token
      authStatus.value = AuthStatus.Autorizado
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    authStatus,

    // Getters
    prompt_nuevo,
    isCheking: computed(() => authStatus.value === AuthStatus.Cheking),
    isAutenticado: computed(() => authStatus.value === AuthStatus.Autorizado),
    isAdmin: computed(() => user.value?.rol === 'admin'),

    username: computed(() => user.value?.username),

    // Actions
    login,
    logout,
    registro,
    checkAuthStatus,
    mensaje,
    obtener_prompt,
    crearPrompt,
  }
})
