<script lang="ts" setup>
import ErrorHandler from '@/components/ErrorHandlerComponent/ErrorHandler.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref<Date | null>(null)
let interval: ReturnType<typeof setInterval>

const updateTime = () => {
    time.value = new Date()
}

const formattedTime = computed(() => {
    if (!time.value) return ''

    return new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit'
    }).format(time.value)
})

onMounted(() => {
    // Set initial time
    updateTime()

    // Update every minute
    interval = setInterval(updateTime, 60000)
})

onUnmounted(() => {
    clearInterval(interval)
})
</script>

<template>
    <div class="time-component">
        <ErrorHandler fallback="Time Unavailable">
            <p class="text-white mb-0">{{ formattedTime }}</p>
        </ErrorHandler>
    </div>
</template>

<style lang="scss" scoped>
.time-component {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    ;

    .text-white {
        color: white;
    }

    .mb-0 {
        margin-bottom: 0;
    }
}
</style>