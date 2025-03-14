<script setup>
// Importación de componentes de Flowbite-Vue para construir interfaces (por ejemplo, tablas, botones, etc.)
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'

// Importación de iconos de Lucide-Vue para agregar elementos gráficos al UI
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

// Importamos funciones reactivas y hooks de Vue para gestionar el estado y ciclo de vida
import { ref, onMounted, nextTick } from 'vue'

// Se obtiene la instancia del store de autenticación. Es importante que la importación de useAuthStore se realice (más adelante se importa explícitamente)
const authStore = useAuthStore()

// Estado para mostrar u ocultar el sidebar
const isOpen = ref(false)

// Importación del store de autenticación. (Aunque se utilizó anteriormente, esta línea debería estar idealmente antes)
import { useAuthStore } from '@/auth/stores/auth.store'

// Variable reactiva para almacenar el input del usuario en el chat
const userInput = ref('')
// Array reactivo para almacenar los mensajes (tanto del usuario como del bot)
const messages = ref([])
// Flag reactivo que indica si el bot está "escribiendo" o procesando una respuesta
const isTyping = ref(false)

// Referencia a un contenedor HTML donde se mostrarán los mensajes del chat.
const messagesContainer = ref(null)

// Función que agrega un mensaje del bot al array de mensajes y luego llama a scrollToBottom
const addBotMessage = (content, buttons = []) => {
  content.replace('\n', '')
  messages.value.push({ sender: 'bot', content, buttons })
  scrollToBottom()
}

// Función que agrega un mensaje del usuario al array de mensajes y luego llama a scrollToBottom
const addUserMessage = (content, buttons = []) => {
  messages.value.push({ sender: 'user', content, buttons })
  scrollToBottom()
}

// Función para desplazar el scroll del contenedor de mensajes hasta el final
// nextTick asegura que el DOM se haya actualizado con el nuevo mensaje antes de cambiar la posición del scroll.
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const isSidebarMinimized = ref(false)

// Función que se ejecuta al enviar un mensaje.
// Valida que el input del usuario no esté vacío, agrega el mensaje, limpia el input,
// activa el indicador de "escribiendo" y, tras un retardo, llama a generar la respuesta del bot.
const sendMessage = () => {
  if (!userInput.value.trim()) return

  // Agregamos el mensaje del usuario al chat
  addUserMessage(userInput.value)
  // Guardamos el mensaje en una variable antes de limpiar el input
  const userQuery = userInput.value
  userInput.value = ''

  // Indicamos que el bot está procesando la respuesta
  isTyping.value = true
  // Simulamos un retardo de 1.5 segundos antes de generar la respuesta del bot
  generateAIResponse(userQuery)
}

// Declaración de una variable reactiva para almacenar el threadId del chat.
// Este identificador se utilizará para mantener la continuidad de la conversación.
const threadId = ref('') // Añadir referencia para el thread ID

// Función asíncrona que se encarga de generar la respuesta del bot a partir del query del usuario.
// Hace uso del store de autenticación para enviar el mensaje y obtener la respuesta del backend.
const generateAIResponse = async (query) => {
  try {
    isTyping.value = true
    // Si no existe un threadId, se asigna utilizando el nombre de usuario del store de autenticación.
    if (!threadId.value) {
      //console.log(authStore.prompt_nuevo['id'])
      console.log('id dentro de generar una respuesta ', authStore.user.username)
      console.log('id dentro de generar una respuesta ', id_prompt_actual.value)
      threadId.value = authStore.user.username + '_' + id_prompt_actual.value
      console.log(threadId.value)
    }

    // Se envía el mensaje al backend usando la función "mensaje" del store y se espera la respuesta.
    const response = await authStore.mensaje(query, threadId.value)
    // Se agrega la respuesta del bot al chat. Se accede al valor de la respuesta (ya que es un ref)
    addBotMessage(response.value)
    isTyping.value = false
  } catch (error) {
    // En caso de error, se muestra el error en la consola y se agrega un mensaje de error en el chat.
    console.error('Error:', error)
    addBotMessage('Ocurrió un error al comunicarse con el servidor')
    isTyping.value = false
  } finally {
    isTyping.value = false
    // Finalmente se desactiva el indicador de "escribiendo"
  }
}

const prompts = ref([])

const tiene_prompt = ref(false)

const cargarPrompts = async () => {
  try {
    console.log('cargarprompt funcion', authStore.username)
    const respuesta = await authStore.obtener_prompt(authStore.username)

    console.log('resultado de respuesta dentro de cargar prompt.', respuesta)
    console.log('largo de respuesta :', respuesta.value.length)

    // Verifica si hay datos en respuesta.value
    if (respuesta.value && respuesta.value.length > 0) {
      prompts.value = respuesta.value
      console.log('Prompts cargados:', prompts.value)

      for (let i = 0; i < prompts.value.length; i++) {
        const prompt = prompts.value[i]
        let idString = String(prompt.id)
        const buttons = [
          { text: 'Continuar', action: () => Continuar(prompt.id) },
          {
            text: 'Eliminar',
            action: () => {
              authStore.eliminarPrompt(authStore.username, idString)
              messages.value = []
              addBotMessage('¡Bienvenido al Asistente Nebula Prompt! \n')
              cargarPrompts_3()
            },
          },
        ]
        console.log(prompt)
        const content = prompt.prompt.trim() === '' ? 'Mensaje por defecto' : prompt.prompt
        // Llama a la función addBotMessage con el contenido del prompt y los botones
        addBotMessage(content, buttons)
      }
      tiene_prompt.value = true
    } else {
      tiene_prompt.value = false
      prompts.value = []
      console.log('No hay datos en prompts:', prompts.value)
    }
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

const id_prompt_actual = ref('')

const Continuar = async (id) => {
  id_prompt_actual.value = id
  console.log(id_prompt_actual.value)
  messages.value = []
  fase_1.value = true
  addBotMessage('Cuentame de que trata tu necesidad')
}

const crearPromptNuevo = async (username) => {
  try {
    authStore.prompt_nuevo.value = {}
    console.log(username)
    const respuesta = await authStore.crearPrompt(username)
    console.log('resultado de respuesta de vue.js.', authStore.prompt_nuevo['id'])
    console.log('resultado de respuesta de vue.js.', authStore.prompt_nuevo['prompt'])
    console.log('resultado de respuesta de vue.js.', authStore.prompt_nuevo['mensajes'])
    // Si respuesta.value es un objeto válido y tiene la propiedad id:
    if (respuesta.value && respuesta.value.id) {
      console.log('Prompt creado correctamente:', respuesta.value)
      const content =
        authStore.prompt_nuevo['prompt'].trim() === ''
          ? 'Prompt creado recien'
          : authStore.prompt_nuevo['prompt']
      let idString = String(authStore.prompt_nuevo['id'])
      const buttons = [
        { text: 'Continuar', action: () => Continuar(authStore.prompt_nuevo['id']) },
        {
          text: 'Eliminar',
          action: () => {
            authStore.eliminarPrompt(authStore.username, idString)
            messages.value = []
            addBotMessage('¡Bienvenido al Asistente Nebula Prompt! \n')
            cargarPrompts_3()
          },
        },
      ]

      // Llama a la función addBotMessage con el contenido del prompt y los botones
      addBotMessage(content, buttons)
    }
    // Si la respuesta es null o no tiene id:
    else if (respuesta.value === null) {
      console.log('Respuesta null:', respuesta.value)
    } else {
      console.error('Error al obtener prompts:', respuesta.mensaje)
    }
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

const formatMessage = (message) => {
  return message
}

const fase_1 = ref(false)

const cargarPrompts_2 = async () => {
  try {
    console.log('cargarprompt funcion', authStore.username)
    const respuesta = await authStore.obtener_prompt(authStore.username)

    // Verifica si hay datos en respuesta.value
    if (respuesta.value && respuesta.value.length > 0) {
      addBotMessage('Elija una opción para empezar:')

      addBotMessage('Crear un nuevo prompt.', [
        { text: 'Crear Prompt', action: () => crearPromptNuevo(authStore.username) },
      ])
      addBotMessage('Continuar con un prompt ya creado', [
        { text: 'Mostrar Prompt guardados', action: cargarPrompts },
      ])
    } else {
      addBotMessage('Inicia creando un Prompt', [
        { text: 'Crear Prompt', action: () => crearPromptNuevo(authStore.username) },
      ])
      console.log('No hay datos en prompts:', prompts.value)
    }
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

const cargarPrompts_3 = async () => {
  try {
    messages.value = []
    console.log('cargarprompt funcion', authStore.username)
    const respuesta = await authStore.obtener_prompt(authStore.username)

    // Verifica si hay datos en respuesta.value
    if (respuesta.value && respuesta.value.length > 0) {
      addBotMessage('¡Bienvenido al Asistente Nebula Prompt! \n')
      addBotMessage('Elija una opción para empezar:')

      addBotMessage('Crear un nuevo prompt.', [
        { text: 'Crear Prompt', action: () => crearPromptNuevo(authStore.username) },
      ])
      addBotMessage('Continuar con un prompt ya creado', [
        { text: 'Mostrar Prompt guardados', action: cargarPrompts },
      ])
    } else {
      addBotMessage('¡Bienvenido al Asistente Nebula Prompt! \n')
      addBotMessage('Inicia creando un Prompt', [
        { text: 'Crear Prompt', action: () => crearPromptNuevo(authStore.username) },
      ])
      console.log('No hay datos en prompts:', prompts.value)
    }
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}

// Hook onMounted que se ejecuta al montar el componente.
// Se envía un mensaje de bienvenida del bot para iniciar la conversación.
onMounted(() => {
  cargarPrompts_2()

  addBotMessage('¡Bienvenido al Asistente Nebula Prompt! \n')
})
</script>

<template>
  <div class="chatbot-container">
    <div class="stars-bg"></div>

    <main class="main-content">
      <div class="chat-interface">
        <div class="chat-header">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-white">AI Prompt Assistant</h2>
              <p class="text-sm text-gray-400">Crear el Prompt perfecto para sus necesidades</p>
            </div>
            <button @click="cargarPrompts_3()" v-if="fase_1" class="send-button">Volver</button>
          </div>
        </div>

        <div class="messages-container" ref="messagesContainer">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
            :class="{
              'user-message': message.sender === 'user',
              'bot-message': message.sender === 'bot',
            }"
          >
            <div class="message-avatar">
              <UserIcon v-if="message.sender === 'user'" class="h-6 w-6" />
              <SparklesIcon v-else class="h-6 w-6" />
            </div>
            <div class="message-content">
              <p v-html="formatMessage(message.content)"></p>
              <div v-if="message.buttons.length > 0">
                <button
                  v-for="(button, btnIndex) in message.buttons"
                  :key="btnIndex"
                  @click="button.action"
                  class="bg-slate-500 hover:bg-green-600 text-black font-semibold rounded-md py-2 px-1 w-full block mb-4 mt-2"
                >
                  {{ button.text }}
                </button>
              </div>
              <div v-else></div>
            </div>
          </div>

          <div v-if="isTyping" class="message">
            <div class="message-avatar">
              <SparklesIcon class="h-6 w-6" />
            </div>
            <div class="message-content">
              <h1>pensando ...</h1>
              <div class="dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="input-container" v-if="fase_1">
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            placeholder="escribe tu mensaje"
            class="message-input"
          ></textarea>
          <button @click="sendMessage" class="send-button" :disabled="!userInput.trim()">
            <SendIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>

    <!-- Save Prompt Modal -->
  </div>
</template>

<style scoped>
/* Ocultar sidebar en pantallas pequeñas */
@media (max-width: 768px) {
  .translate-x-0 {
    transform: translateX(0);
  }
  .-translate-x-full {
    transform: translateX(-100%);
  }
}

/* Solo se aplica en pantallas pequeñas */
@media screen and (max-width: 400px) {
  .chat-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* Div que ocupará todo el espacio disponible */
  .full-screen-div {
    width: 100%; /* Ocupa el 100% del ancho de la ventana */
    height: 70vh; /* Ocupa el 70% de la altura de la ventana */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Alinea los elementos al final de la columna */
    box-sizing: border-box; /* Esto asegura que el borde se cuente dentro del tamaño total del div */
  }

  /* Contenedor de los botones */
  .button-container {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between; /* Espacia los botones de forma que estén alineados de izquierda a derecha */
    width: 100%; /* Asegura que los botones ocupen todo el ancho disponible */
    padding: 10px; /* Añade algo de espacio alrededor de los botones */
  }

  /* Estilo de los botones */
  .btn {
    padding: 5px 10px;
    font-size: 15px;
    border: 2px solid #007bff; /* Borde azul */
    background-color: #007bff; /* Fondo azul */
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  /* Efecto hover de los botones */
  .btn:hover {
    background-color: #0056b3; /* Fondo azul más oscuro */
  }
}

/* Base styles */
:root {
  --color-bg-primary: #0a0b1a;
  --color-bg-secondary: #141539;
  --color-accent-primary: #6d28d9;
  --color-accent-secondary: #8b5cf6;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0aec0;
  --color-border: #2d3748;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.chatbot-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Stars background */
.stars-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1a1b4b 0%, #0a0b1a 100%);
  z-index: -1;
  overflow: hidden;
}

.stars-bg::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 2px),
    radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size:
    550px 550px,
    350px 350px,
    250px 250px;
  background-position:
    0 0,
    40px 60px,
    130px 270px;
}

/* Header styles */
.header {
  backdrop-filter: blur(10px);
  background-color: rgba(10, 11, 26, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.action-button {
  display: flex;
  align-items: center;
  background-color: rgba(109, 40, 217, 0.2);
  color: rgb(208, 202, 202);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: rgba(109, 40, 217, 0.4);
  color: white;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 1024px) {
  .main-content {
    flex-direction: row;
    gap: 1.5rem;
  }
}

/* Chat interface */
.chat-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(26, 27, 75, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  height: calc(100vh - 140px);
}

.prompt-type-select {
  background-color: rgba(26, 27, 75, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.5rem;
  color: white;
  min-width: 150px;
}

.prompt-type-select:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.bot-message {
  align-self: flex-start;
}

.message-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(109, 40, 217, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.75rem;
}

.user-message .message-avatar {
  background-color: rgba(99, 102, 241, 0.2);
}

.message-content {
  background-color: rgba(26, 27, 75, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  max-width: calc(100% - 4rem);
}

.user-message .message-content {
  background-color: rgba(109, 40, 217, 0.3);
  color: white;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(26, 27, 75, 0.8);
  border-radius: 0.5rem;
  width: fit-content;
  margin-left: 3.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: var(--color-text-secondary);
  border-radius: 50%;
  margin: 0 2px;
  animation: bounce 1.5s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

.input-container {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.message-input {
  flex-grow: 1;
  background-color: rgba(26, 27, 75, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.75rem;
  color: white;
  resize: none;
  height: 2.5rem;
  max-height: 150px;
  transition: height 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  height: 5rem;
}

.send-button {
  background-color: var(--color-accent-primary);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: var(--color-accent-secondary);
  transform: scale(1.05);
}

.send-button:disabled {
  background-color: rgba(109, 40, 217, 0.2);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

/* Prompt preview */
.prompt-preview {
  background-color: rgba(26, 27, 75, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 1.5rem;
  width: 100%;
}

@media (min-width: 1024px) {
  .prompt-preview {
    width: 350px;
    margin-top: 0;
    height: fit-content;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }
}

.preview-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-button {
  display: flex;
  align-items: center;
  background-color: rgba(109, 40, 217, 0.2);
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: rgba(109, 40, 217, 0.4);
  color: white;
}

.preview-content {
  padding: 1.5rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-container {
  background-color: var(--color-bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.form-input {
  width: 100%;
  background-color: rgba(26, 27, 75, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.75rem;
  color: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.save-button {
  width: 100%;
  background-color: var(--color-accent-primary);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: all 0.2s;
}

.save-button:hover {
  background-color: var(--color-accent-secondary);
}

/* Media queries para dispositivos móviles y tabletas */
@media (max-width: 640px) {
  .main-content {
    padding: 1rem;
  }

  .chat-interface {
    height: calc(90vh - 100px);
  }

  .chat-header,
  .input-container {
    padding: 0.75rem 1rem;
  }

  .messages-container {
    padding: 1rem;
  }

  .message-content {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .prompt-preview {
    margin-top: 1rem;
    border-radius: 0.375rem;
  }

  .modal-container {
    margin: 0 1rem;
  }
}
</style>
