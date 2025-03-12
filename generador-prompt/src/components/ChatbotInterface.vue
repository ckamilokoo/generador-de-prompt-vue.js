<script setup>
import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'
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
import { ref, onMounted, nextTick } from 'vue'
const authStore = useAuthStore()

import { FwbButton, FwbModal } from 'flowbite-vue'

const isShowModal = ref(false)

function closeModal() {
  isShowModal.value = false
}
function showModal() {
  isShowModal.value = true
}

import { useAuthStore } from '@/auth/stores/auth.store'

const userInput = ref('')
const messages = ref([])
const isTyping = ref(false)

const sidebar = ref(false)

const messagesContainer = ref(null)

const addBotMessage = (content) => {
  messages.value.push({ sender: 'bot', content })
  scrollToBottom()
}

const addUserMessage = (content) => {
  messages.value.push({ sender: 'user', content })
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (!userInput.value.trim()) return

  addUserMessage(userInput.value)
  const userQuery = userInput.value
  userInput.value = ''

  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    generateAIResponse(userQuery)
  }, 1500)
}

const threadId = ref('') // Añadir referencia para el thread ID

const generateAIResponse = async (query) => {
  try {
    isTyping.value = true
    // Si no tenemos threadId, lo creamos a partir del username del usuario
    if (!threadId.value) {
      threadId.value = authStore.user.username
    }

    // Enviamos el mensaje al backend y obtenemos la respuesta (que es un ref)
    const response = await authStore.mensaje(query, threadId.value)
    // Como response es un ref, accedemos a su valor con .value
    // Y lo mostramos en el chat llamando a addBotMessage
    addBotMessage(response.value)
  } catch (error) {
    console.error('Error:', error)
    addBotMessage('Ocurrió un error al comunicarse con el servidor')
  } finally {
    isTyping.value = false
  }
}

const formatMessage = (message) => {
  return message.replace(/\n/g, '<br>')
}

onMounted(() => {
  addBotMessage(
    '¡Bienvenido al Asistente Nebula Prompt!\n Estoy aquí para ayudarte a crear el prompt perfecto para tus necesidades de IA \n' +
      ' Que tipo de Prompt te gustaria crear hoy?',
  )
})
</script>

<template>
  <div class="chatbot-container">
    <div class="stars-bg"></div>

    <main class="main-content">
      <div class="full-screen-div">
        <div class="">
          <fwb-modal position="center" v-if="isShowModal" @close="closeModal">
            <template #header>
              <div class="flex items-center text-lg">Esta seguro que quiere crear otro prompt.</div>
            </template>
            <template #body>
              <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                actualmente cuenta con 2 prompt por lo cual puede crear 3 mas solamente.
              </p>
            </template>
            <template #footer>
              <div class="flex justify-between">
                <fwb-button @click="closeModal" color="alternative"> Cancelar </fwb-button>
                <fwb-button @click="closeModal" color="green"> Crear </fwb-button>
              </div>
            </template>
          </fwb-modal>

          <div class="mb-25">
            <fwb-table hoverable>
              <fwb-table-head>
                <fwb-table-head-cell>Prompt</fwb-table-head-cell>
                <fwb-table-head-cell>Continuar</fwb-table-head-cell>
              </fwb-table-head>
              <fwb-table-body>
                <fwb-table-row>
                  <fwb-table-cell>
                    Apple <br />
                    iPhone
                  </fwb-table-cell>
                  <fwb-table-cell>
                    <fwb-a href="#">Edit </fwb-a>
                  </fwb-table-cell>
                </fwb-table-row>
                <fwb-table-row>
                  <fwb-table-cell>camilo</fwb-table-cell>
                  <fwb-table-cell>
                    <fwb-a href="#">Edit </fwb-a>
                  </fwb-table-cell>
                </fwb-table-row>
                <fwb-table-row>
                  <fwb-table-cell
                    >Magic <br />
                    Mouse 2</fwb-table-cell
                  >
                  <fwb-table-cell>
                    <fwb-a href="#">Edit </fwb-a>
                  </fwb-table-cell>
                </fwb-table-row>
                <fwb-table-row>
                  <fwb-table-cell
                    >Magic <br />
                    Mouse 2</fwb-table-cell
                  >
                  <fwb-table-cell>
                    <fwb-a href="#">Edit </fwb-a>
                  </fwb-table-cell>
                </fwb-table-row>
                <fwb-table-row>
                  <fwb-table-cell
                    >Magic <br />
                    Mouse 2</fwb-table-cell
                  >
                  <fwb-table-cell>
                    <fwb-a href="#">Edit </fwb-a>
                  </fwb-table-cell>
                </fwb-table-row>
              </fwb-table-body>
            </fwb-table>
          </div>
        </div>
        <div class="button-container">
          <button class="btn" @click="showModal">Nuevo Prompt</button>
          <button class="btn">Historial Prompt</button>
        </div>
      </div>

      <div v-if="sidebar" class="chat-interface">
        <div v-if="sidebar" class="chat-header">
          <div>
            <h2 class="text-xl font-semibold text-white">AI Prompt Assistant</h2>
            <p class="text-sm text-gray-400">Crear el Prompt perfecto para sus necesidades</p>
          </div>
        </div>

        <div v-if="sidebar" class="messages-container" ref="messagesContainer">
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
            </div>
          </div>

          <div v-if="isTyping" class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>

        <div v-if="sidebar" class="input-container">
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            placeholder="Describe what kind of prompt you need..."
            class="message-input"
          ></textarea>
          <button @click="sendMessage" class="send-button" :disabled="!userInput.trim()">
            <SendIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Solo se aplica en pantallas pequeñas */
@media screen and (max-width: 500px) {
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
  height: calc(100vh - 180px);
}

.chat-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    height: calc(100vh - 140px);
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
