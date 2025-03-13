import { Backend } from '@/api/Backend_online'

import { isAxiosError } from 'axios'

//{
//  "message": "Conversación creada exitosamente",
//  "data": [
//      {
//          "id": 13,
//          "user_id": 7,
//          "messages": [],
//          "prompt": "clasificar texto",
//          "created_at": "2025-03-13T06:13:08.103544"
//      }
//  ]
//}

export const Nuevo_PromptActions = async (username: string, prompt: string, messages: []) => {
  try {
    const { data } = await Backend.post('/conversaciones/', { username, prompt, messages })

    return {
      ok: true,
      mensaje: data.message,
      id: data.data.id,
      user_id: data.data.user_id,
    }
  } catch (error) {
    console.log(error)
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos',
      }
    }
    throw new Error('No se pudo realizar la peticion ')
  }
}

interface Conversacion {
  id: number
  prompt: string
  messages: any[]
}

interface RespuestaAPI {
  tiene_conversaciones: Conversacion[]
}

export const Obtener_PromptActions = async (username: string) => {
  try {
    const { data } = await Backend.get<RespuestaAPI>(`/conversaciones/${username}`)

    const conversaciones: Conversacion[] = data.tiene_conversaciones || []

    if (conversaciones.length === 0) {
      return {
        ok: false,
        mensaje: 'No hay conversaciones disponibles',
        conversaciones: [],
      }
    }
    console.log(conversaciones)
    const listaConversaciones = conversaciones.map((conv: Conversacion) => ({
      id: conv.id,
      prompt: conv.prompt,
      messages: conv.messages,
    }))
    console.log(listaConversaciones)
    return {
      ok: true,
      mensaje: 'Conversaciones obtenidas correctamente',
      conversaciones: listaConversaciones,
    }
  } catch (error) {
    console.error('Error al obtener conversaciones:', error)

    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos',
        conversaciones: [],
      }
    }

    return {
      ok: false,
      mensaje: 'Error al obtener las conversaciones',
      conversaciones: [],
    }
  }
}
