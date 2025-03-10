<template>
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
</template>

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
  LinkedinIcon,
  GithubIcon,
  TwitterIcon,
} from 'lucide-vue-next'
</script>

<style scoped></style>
