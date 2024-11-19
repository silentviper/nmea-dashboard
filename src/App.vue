<script setup lang="ts">
import { RouterView } from 'vue-router'
import ErrorHandler from '@/components/ErrorHandlerComponent/ErrorHandler.vue'
</script>

<template>
    <ErrorHandler>
        <div class="app-container min-h-screen bg-black text-white">
            <RouterView v-slot="{ Component }">
                <template v-if="Component">
                    <Transition mode="out-in" enter-active-class="transition duration-200 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-200 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <ErrorHandler>
                            <Suspense>
                                <!-- Main Content -->
                                <component :is="Component" />

                                <!-- Loading state -->
                                <template #fallback>
                                    <div class="flex items-center justify-center min-h-screen">
                                        <div
                                            class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500">
                                        </div>
                                    </div>
                                </template>
                            </Suspense>
                        </ErrorHandler>
                    </Transition>
                </template>
            </RouterView>
        </div>
    </ErrorHandler>
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    @apply bg-black;
}

#app {
    height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.app-container {
    @apply container mx-auto px-4;
}
</style>