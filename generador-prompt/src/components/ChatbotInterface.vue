<script setup>
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

import { useAuthStore } from '@/auth/stores/auth.store'

const userInput = ref('')
const messages = ref([])
const isTyping = ref(false)
const generatedPrompt = ref('')
const showSaveModal = ref(false)
const promptTitle = ref('')
const promptCategory = ref('image')

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
      <div class="chat-interface">
        <div class="chat-header">
          <div>
            <h2 class="text-xl font-semibold text-white">AI Prompt Assistant</h2>
            <p class="text-sm text-gray-400">Crear el Prompt perfecto para sus necesidades</p>
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
            </div>
          </div>

          <div v-if="isTyping" class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>

        <div class="input-container">
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

      <div class="prompt-preview" v-if="generatedPrompt">
        <div class="preview-header">
          <h3 class="text-lg font-semibold text-white">Generated Prompt</h3>
          <button @click="copyPrompt" class="copy-button">
            <ClipboardIcon class="h-5 w-5 mr-1" />
            Copy
          </button>
        </div>
        <div class="preview-content">
          <p>{{ generatedPrompt }}</p>
        </div>
      </div>
    </main>

    <!-- Save Prompt Modal -->
    <div v-if="showSaveModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="text-xl font-semibold text-white">Save Your Prompt</h3>
          <button @click="showSaveModal = false" class="text-gray-400 hover:text-white">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Prompt Title</label>
            <input
              type="text"
              v-model="promptTitle"
              class="form-input"
              placeholder="Give your prompt a name"
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 mb-2">Category</label>
            <select v-model="promptCategory" class="form-input">
              <option value="image">Image Generation</option>
              <option value="code">Code Assistant</option>
              <option value="writing">Content Writing</option>
              <option value="data">Data Analysis</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button @click="confirmSave" class="save-button">Save Prompt</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
