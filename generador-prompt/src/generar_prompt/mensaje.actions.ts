import { Backend } from '@/api/Backend_online'

import { isAxiosError } from 'axios'

export const Generar_PromptActions = async (mensaje: string, thread_id: string) => {
  try {
    const { data } = await Backend.post('/mensajes_prompt', { mensaje, thread_id })

    return {
      ok: true,
      respuesta: data.respuesta,
      thread_id: data.thread_id,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos',
      }
    }
    throw new Error('No se pudo realizar la peticion ')
  }
}
