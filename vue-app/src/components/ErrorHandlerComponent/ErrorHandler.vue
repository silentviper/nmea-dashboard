<script setup lang="ts">
import { onErrorCaptured, ref, useSlots } from 'vue'

const props = defineProps<{
  fallback?: string | ((error: Error) => string)
}>()

const error = ref<Error | null>(null)
const slots = useSlots()

onErrorCaptured((err: Error) => {
  error.value = err
  return false // Prevent error from propagating
})

const renderFallback = (err: Error): string => {
  if (!props.fallback) {
    return 'An error occurred'
  }
  
  if (typeof props.fallback === 'function') {
    return props.fallback(err)
  }
  
  return props.fallback
}
</script>

<template>
  <div class="error-boundary">
    <template v-if="error">
      <div class="error-content">
        {{ error ? renderFallback(error) : 'Something went wrong' }}
        <button 
          class="retry-button"
          @click="error = null"
        >
          Retry
        </button>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style scoped>
.error-boundary {
  width: 100%;
}

.error-content {
  padding: 1rem;
  border: 1px solid #ff0000;
  border-radius: 4px;
  margin: 1rem 0;
  background: #fff5f5;
  color: #ff0000;
  text-align: center;
}

.retry-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background: #cc0000;
}
</style>