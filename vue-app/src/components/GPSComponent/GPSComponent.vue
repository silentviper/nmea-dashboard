<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSignalK } from '@/composables/useSignalK'
import type { SignalKMessage } from '@/composables/useSignalK'
import ErrorHandler from '@/components/ErrorHandlerComponent/ErrorHandler.vue'

interface GPSData {
    latitude?: number
    longitude?: number
    speed?: number
    courseOverGround?: number
    fix?: boolean
}

const gpsData = ref<GPSData>({})
const signalK = useSignalK()

const handleSignalKMessage = (message: SignalKMessage) => {
    message.updates?.[0]?.values?.forEach(update => {
        switch (update.path) {
            case 'navigation.position.latitude':
                gpsData.value.latitude = update.value
                break
            case 'navigation.position.longitude':
                gpsData.value.longitude = update.value
                break
            case 'navigation.speedOverGround':
                gpsData.value.speed = update.value * 1.943844 // Convert to knots
                break
            case 'navigation.courseOverGround':
                gpsData.value.courseOverGround = update.value * 57.2958 // Convert to degrees
                break
            case 'navigation.gnss.fix':
                gpsData.value.fix = update.value === 'GPS'
                break
        }
    })
}

onMounted(() => {
    signalK.connect()
    // Subscribe to GPS-related paths
    const paths = [
        'navigation.position.latitude',
        'navigation.position.longitude',
        'navigation.speedOverGround',
        'navigation.courseOverGround',
        'navigation.gnss.fix'
    ]

    paths.forEach(path => {
        signalK.subscribe({
            path,
            period: 1000
        })
    })

    signalK.addMessageHandler(handleSignalKMessage)
})

onUnmounted(() => {
    signalK.removeMessageHandler(handleSignalKMessage)
    signalK.disconnect()
})
</script>

<template>
    <div class="gps-component">
        <ErrorHandler fallback="GPS Data Unavailable">
            <p class="mb-0">GPS</p>
            <div v-if="gpsData.fix" class="gps-data">
                <div v-if="gpsData.latitude && gpsData.longitude" class="coordinates">
                    {{ gpsData.latitude.toFixed(4) }}°, {{ gpsData.longitude.toFixed(4) }}°
                </div>
                <div v-if="gpsData.speed !== undefined" class="speed">
                    {{ gpsData.speed.toFixed(1) }} kts
                </div>
                <div v-if="gpsData.courseOverGround !== undefined" class="course">
                    {{ gpsData.courseOverGround.toFixed(0) }}°
                </div>
            </div>
            <div v-else class="no-fix">
                No GPS Fix
            </div>
        </ErrorHandler>
    </div>
</template>

<style lang="scss" scoped>
.gps-component {

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: #fff;

    .gps-data {
        font-size: 0.9rem;

        .coordinates {
            color: #4CAF50;
        }

        .speed,
        .course {
            color: #2196F3;
        }
    }

    .no-fix {
        color: #f44336;
    }

    .mb-0 {
        margin-bottom: 0;
    }
}
</style>