<script setup>
import { ref, onMounted, nextTick } from 'vue'
import {
  SparklesIcon,
  RocketIcon,
  CheckIcon,
  UserIcon,
  SendIcon,
  SaveIcon,
  DownloadIcon,
  PlusIcon,
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
  XIcon,
  BrainIcon,
  ZapIcon,
  StarIcon,
} from 'lucide-vue-next'

// Reactive state
const currentView = ref('landing')
const isLoggedIn = ref(false)
const showLoginModal = ref(false)
const showPaymentModal = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const selectedPlan = ref({})
const userInput = ref('')
const messages = ref([])
const isTyping = ref(false)
const messagesContainer = ref(null) // Template ref
const currentPrompt = ref({ id: null, title: '', content: '' })

// Static data
const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Suggestions',
    description: 'Our AI analyzes your needs and suggests optimal prompt structures and phrasings.',
  },
  {
    icon: ZapIcon,
    title: 'Instant Refinement',
    description: 'Get real-time feedback and improvements to make your prompts more effective.',
  },
  {
    icon: StarIcon,
    title: 'Template Library',
    description: 'Access our growing collection of proven prompt templates for various use cases.',
  },
  // ... resto de features
]

const pricingPlans = [
  {
    name: 'Explorer',
    description: 'Perfect for beginners',
    price: 9,
    features: ['50 prompt generations per month', 'Basic template library', 'Email support'],
    featured: false,
  },
  {
    name: 'Voyager',
    description: 'Most popular choice',
    price: 19,
    features: [
      'Unlimited prompt generations',
      'Full template library',
      'Priority support',
      'Prompt history & saving',
    ],
    featured: true,
  },
  {
    name: 'Pioneer',
    description: 'For power users',
    price: 39,
    features: [
      'Everything in Voyager',
      'Advanced analytics',
      'Custom templates',
      'API access',
      'Dedicated support',
    ],
    featured: false,
  },
  // ... resto de planes
]

const promptHistory = ref([
  { id: 1, title: 'Image Generation Prompt', content: 'A prompt for generating detailed images' },
  { id: 2, title: 'Code Assistant Prompt', content: 'A prompt for helping with coding tasks' },
  { id: 3, title: 'Content Writing Prompt', content: 'A prompt for creating blog articles' },
])

// Lifecycle hooks
onMounted(() => {
  if (currentView.value === 'app') {
    addBotMessage(
      "Welcome to Prompt Nebula! I'm your AI assistant designed to help you craft the perfect prompts. " +
        "Tell me what kind of prompt you're looking to create, and I'll guide you through the process. " +
        'For example, you might want a prompt for: <br><br>' +
        '• Generating detailed images<br>' +
        '• Creating code solutions<br>' +
        '• Writing marketing copy<br>' +
        '• Analyzing data<br><br>' +
        'What type of prompt would you like to create today?',
    )
  }
})

// Métodos
const navigateToPricing = () => {
  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })
}

const selectPlan = (plan) => {
  selectedPlan.value = plan
  showPaymentModal.value = true
}

const processPayment = () => {
  showPaymentModal.value = false
  isLoggedIn.value = true
  navigateToApp()
}

const login = () => {
  if (loginEmail.value && loginPassword.value) {
    isLoggedIn.value = true
    showLoginModal.value = false
  }
}

const navigateToApp = () => {
  currentView.value = 'app'
  setTimeout(() => {
    if (messages.value.length === 0) {
      addBotMessage(
        "Welcome to Prompt Nebula! I'm your AI assistant designed to help you craft the perfect prompts. " +
          "Tell me what kind of prompt you're looking to create, and I'll guide you through the process. " +
          'For example, you might want a prompt for: <br><br>' +
          '• Generating detailed images<br>' +
          '• Creating code solutions<br>' +
          '• Writing marketing copy<br>' +
          '• Analyzing data<br><br>' +
          'What type of prompt would you like to create today?',
      )
    }
  }, 100)
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

const addUserMessage = (content) => {
  messages.value.push({
    sender: 'user',
    content,
  })
  scrollToBottom()
}

const addBotMessage = (content) => {
  messages.value.push({
    sender: 'bot',
    content,
  })
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatMessage = (message) => {
  return message.replace(/\n/g, '<br>')
}

const generateAIResponse = (query) => {
  // ... misma lógica de generación de respuesta
}

const createNewPrompt = () => {
  currentPrompt.value = { id: null, title: 'New Prompt', content: '' }
  messages.value = []
  addBotMessage("Let's create a new prompt! What type of prompt would you like to work on today?")
}

const loadPrompt = (prompt) => {
  currentPrompt.value = { ...prompt }
  messages.value = []
  addBotMessage(
    `I've loaded your "${prompt.title}" prompt. Would you like to edit it or use it as a starting point for a new prompt?`,
  )
}

const savePrompt = () => {
  if (!currentPrompt.value.title) {
    const userMessages = messages.value.filter((m) => m.sender === 'user')
    if (userMessages.length > 0) {
      currentPrompt.value.title = userMessages[0].content.substring(0, 30) + '...'
    } else {
      currentPrompt.value.title = 'New Prompt'
    }
  }

  if (!currentPrompt.value.id) {
    const newId = promptHistory.value.length + 1
    currentPrompt.value.id = newId
    promptHistory.value.push({ ...currentPrompt.value })
  }

  alert('Prompt saved successfully!')
}

const exportPrompt = () => {
  alert('Prompt exported successfully!')
}
</script>

<template>
  <div class="app-container">
    <div class="stars-bg"></div>

    <main>
      <section v-if="currentView === 'landing'" class="landing-section">
        <div class="hero-section">
          <div class="container mx-auto px-4 py-20 text-center">
            <h2 class="text-5xl font-bold mb-6 text-white leading-tight">
              Craft Perfect Prompts <br />
              <span class="text-gradient">Among the Stars</span>
            </h2>
            <p class="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
              Unlock the full potential of AI with expertly crafted prompts. Our cosmic assistant
              helps you create the perfect instructions for any AI model.
            </p>
            <button @click="navigateToPricing" class="cta-button">
              Start Your Journey
              <RocketIcon class="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        <div id="features" class="features-section">
          <div class="container mx-auto px-4 py-20">
            <h3 class="section-title">Stellar Features</h3>
            <div class="grid md:grid-cols-3 gap-8 mt-12">
              <div v-for="(feature, index) in features" :key="index" class="feature-card">
                <div class="icon-container">
                  <component :is="feature.icon" class="h-8 w-8 text-purple-400" />
                </div>
                <h4 class="text-xl font-semibold mb-3 text-white">{{ feature.title }}</h4>
                <p class="text-gray-400">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="pricing" class="pricing-section">
          <div class="container mx-auto px-4 py-20">
            <h3 class="section-title">Choose Your Orbit</h3>
            <div class="grid md:grid-cols-3 gap-8 mt-12">
              <div
                v-for="(plan, index) in pricingPlans"
                :key="index"
                class="pricing-card"
                :class="{ featured: plan.featured }"
              >
                <div class="pricing-header">
                  <h4 class="text-xl font-semibold mb-2 text-white">{{ plan.name }}</h4>
                  <p class="text-gray-400 mb-4">{{ plan.description }}</p>
                  <div class="price">
                    <span class="currency">$</span>
                    <span class="amount">{{ plan.price }}</span>
                    <span class="period">/month</span>
                  </div>
                </div>
                <ul class="pricing-features">
                  <li v-for="(feature, fIndex) in plan.features" :key="fIndex">
                    <CheckIcon class="h-5 w-5 text-green-400 mr-2" />
                    {{ feature }}
                  </li>
                </ul>
                <button
                  @click="selectPlan(plan)"
                  class="pricing-button"
                  :class="{ 'featured-button': plan.featured }"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="about" class="about-section">
          <div class="container mx-auto px-4 py-20">
            <h3 class="section-title">About Our Cosmic Mission</h3>
            <p class="text-gray-300 max-w-3xl mx-auto text-center mt-8">
              Prompt Nebula was born from a simple idea: make AI more accessible by helping users
              craft the perfect prompts. Our team of AI enthusiasts and prompt engineers have
              created a tool that bridges the gap between human intention and AI understanding.
            </p>
          </div>
        </div>
      </section>

      <section v-else-if="currentView === 'app'" class="app-section">
        <div class="container mx-auto px-4 py-10">
          <div class="app-interface">
            <div class="sidebar">
              <h3 class="text-xl font-semibold mb-6 text-white">Prompt History</h3>
              <ul class="prompt-history">
                <li
                  v-for="(prompt, index) in promptHistory"
                  :key="index"
                  @click="loadPrompt(prompt)"
                  class="history-item"
                >
                  {{ prompt.title }}
                </li>
              </ul>
              <button @click="createNewPrompt" class="new-prompt-button">
                <PlusIcon class="h-5 w-5 mr-2" />
                New Prompt
              </button>
            </div>

            <div class="chat-container">
              <div class="chat-header">
                <h3 class="text-xl font-semibold text-white">
                  {{ currentPrompt.title || 'New Prompt' }}
                </h3>
                <div class="flex space-x-2">
                  <button @click="savePrompt" class="action-button">
                    <SaveIcon class="h-5 w-5 mr-1" />
                    Save
                  </button>
                  <button @click="exportPrompt" class="action-button">
                    <DownloadIcon class="h-5 w-5 mr-1" />
                    Export
                  </button>
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
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="flex items-center">
              <SparklesIcon class="h-6 w-6 text-purple-400" />
              <span class="ml-2 text-white font-semibold">Prompt Nebula</span>
            </div>
            <p class="text-gray-400 text-sm mt-2">© 2025 Prompt Nebula. All rights reserved.</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <TwitterIcon class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <GithubIcon class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <LinkedinIcon class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="text-xl font-semibold text-white">Login to Prompt Nebula</h3>
          <button @click="showLoginModal = false" class="text-gray-400 hover:text-white">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              v-model="loginEmail"
              class="form-input"
              placeholder="your@email.com"
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              v-model="loginPassword"
              class="form-input"
              placeholder="••••••••"
            />
          </div>
          <button @click="login" class="login-submit-button">Login</button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="text-xl font-semibold text-white">Complete Your Purchase</h3>
          <button @click="showPaymentModal = false" class="text-gray-400 hover:text-white">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="modal-body">
          <div class="selected-plan-info mb-6">
            <h4 class="text-lg font-medium text-white mb-2">{{ selectedPlan.name }}</h4>
            <p class="text-gray-400">{{ selectedPlan.description }}</p>
            <div class="price mt-2">
              <span class="text-2xl font-bold text-white">${{ selectedPlan.price }}</span>
              <span class="text-gray-400">/month</span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Card Number</label>
            <input type="text" class="form-input" placeholder="1234 5678 9012 3456" />
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-300 mb-2">Expiry Date</label>
              <input type="text" class="form-input" placeholder="MM/YY" />
            </div>
            <div>
              <label class="block text-gray-300 mb-2">CVC</label>
              <input type="text" class="form-input" placeholder="123" />
            </div>
          </div>
          <div class="mb-6">
            <label class="block text-gray-300 mb-2">Name on Card</label>
            <input type="text" class="form-input" placeholder="John Doe" />
          </div>
          <button @click="processPayment" class="payment-button">
            Pay ${{ selectedPlan.price }}
          </button>
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

.app-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
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

.nav-link {
  color: white;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.login-button {
  background-color: transparent;
  border: 1px solid var(--color-accent-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.login-button:hover {
  background-color: var(--color-accent-primary);
  color: white;
}

.app-button {
  background-color: var(--color-accent-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.app-button:hover {
  background-color: var(--color-accent-secondary);
}

/* Hero section */
.hero-section {
  background:
    linear-gradient(to bottom, rgba(10, 11, 26, 0), rgba(10, 11, 26, 0.8)),
    url('/placeholder.svg?height=800&width=1600');
  background-size: cover;
  background-position: center;
  position: relative;
}

.text-gradient {
  background: linear-gradient(to right, #8b5cf6, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(109, 40, 217, 0.4);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(109, 40, 217, 0.6);
}

/* Section styles */
.section-title {
  text-align: center;
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary));
  border-radius: 2px;
}

/* Features section */
.features-section {
  background-color: rgba(20, 21, 57, 0.7);
  backdrop-filter: blur(10px);
}

.feature-card {
  background-color: rgba(26, 27, 75, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 2rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(109, 40, 217, 0.2);
}

.icon-container {
  background-color: rgba(109, 40, 217, 0.2);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

/* Pricing section */
.pricing-section {
  background-color: rgba(10, 11, 26, 0.7);
}

.pricing-card {
  background-color: rgba(26, 27, 75, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 2rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pricing-card.featured {
  border: 2px solid var(--color-accent-primary);
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(109, 40, 217, 0.3);
  position: relative;
  z-index: 1;
}

.pricing-card:hover:not(.featured) {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(109, 40, 217, 0.2);
}

.pricing-header {
  margin-bottom: 1.5rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 1rem 0;
}

.currency,
.period {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-text-secondary);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex-grow: 1;
}

.pricing-features li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: var(--color-text-secondary);
}

.pricing-button {
  background-color: rgba(109, 40, 217, 0.2);
  color: var(--color-accent-primary);
  border: 1px solid var(--color-accent-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: all 0.2s;
  width: 100%;
}

.pricing-button:hover {
  background-color: var(--color-accent-primary);
  color: white;
}

.pricing-button.featured-button {
  background-color: var(--color-accent-primary);
  color: white;
}

.pricing-button.featured-button:hover {
  background-color: var(--color-accent-secondary);
}

/* About section */
.about-section {
  background-color: rgba(20, 21, 57, 0.7);
  backdrop-filter: blur(10px);
}

/* Footer */
.footer {
  background-color: rgba(10, 11, 26, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* App interface */
.app-section {
  min-height: calc(100vh - 140px);
  padding: 2rem 0;
}

.app-interface {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  height: calc(100vh - 200px);
  background-color: rgba(26, 27, 75, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.sidebar {
  background-color: rgba(20, 21, 57, 0.7);
  padding: 1.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.prompt-history {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  overflow-y: auto;
  flex-grow: 1;
}

.history-item {
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.history-item:hover {
  background-color: rgba(109, 40, 217, 0.2);
  color: white;
}

.new-prompt-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(109, 40, 217, 0.2);
  color: var(--color-accent-primary);
  border: 1px solid var(--color-accent-primary);
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  margin-top: auto;
}

.new-prompt-button:hover {
  background-color: var(--color-accent-primary);
  color: white;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  background-color: rgba(109, 40, 217, 0.2);
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: rgba(109, 40, 217, 0.4);
  color: white;
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
  color: var(--color-text-secondary);
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

.login-submit-button,
.payment-button {
  width: 100%;
  background-color: var(--color-accent-primary);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: all 0.2s;
}

.login-submit-button:hover,
.payment-button:hover {
  background-color: var(--color-accent-secondary);
}

/* Responsive styles */
@media (max-width: 768px) {
  .app-interface {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .message {
    max-width: 90%;
  }
}
</style>
