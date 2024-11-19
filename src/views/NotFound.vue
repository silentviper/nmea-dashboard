<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <p class="text-xl text-gray-400 mb-8">Page not found</p>
      <button
        @click="goHome"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return Home
      </button>
    </div>
  </div>
</template>