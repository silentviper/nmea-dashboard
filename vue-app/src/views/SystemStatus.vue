<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSignalK } from '@/composables/useSignalK'

interface SystemStatus {
    cpuLoad?: number
    memoryUsage?: number
    uptime?: number
    signalKVersion?: string
    connectedClients?: number
}

const status = ref<SystemStatus>({})
const signalK = useSignalK()

onMounted(() => {
    // Subscribe to system metrics
    // Note: Update these paths according to your Signal K server's available metrics
    signalK.connect()
    signalK.subscribe({
        path: 'system.*',
        period: 1000
    })
})
</script>

<template>
    <div class="max-w-4xl mx-auto py-8">
        <h1 class="text-3xl font-bold mb-8">System Status</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- CPU Load -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl mb-4">CPU Load</h2>
                <div class="text-3xl font-bold text-blue-500">
                    {{ status.cpuLoad?.toFixed(1) || '-- ' }}%
                </div>
            </div>

            <!-- Memory Usage -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl mb-4">Memory Usage</h2>
                <div class="text-3xl font-bold text-green-500">
                    {{ status.memoryUsage?.toFixed(1) || '-- ' }}%
                </div>
            </div>

            <!-- Uptime -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl mb-4">Uptime</h2>
                <div class="text-3xl font-bold text-yellow-500">
                    {{ status.uptime ? Math.floor(status.uptime / 3600) : '--' }} hours
                </div>
            </div>

            <!-- Connected Clients -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl mb-4">Connected Clients</h2>
                <div class="text-3xl font-bold text-purple-500">
                    {{ status.connectedClients || '--' }}
                </div>
            </div>
        </div>
    </div>
</template>