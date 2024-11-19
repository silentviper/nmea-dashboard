<script setup lang="ts">
import { ref } from 'vue'
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch.vue'
import GaugesComponent from '@/components/GaugesComponent/GaugesComponent.vue'
import StatusBarComponent from '@/components/StatusBarComponent/StatusBar.vue'
import ErrorHandler from '@/components/ErrorHandlerComponent/ErrorHandler.vue'

interface SwitchPath {
  path: string
  name: string
}

const paths = ref<SwitchPath[]>([
  {
    "path": "electrical.switches.bank.144.1.state",
    "name": "Bilge Pump 1"
  },
  {
    "path": "electrical.switches.bank.144.2.state",
    "name": "Bilge Pump 2"
  },
  {
    "path": "electrical.switches.bank.144.3.state",
    "name": "Bait Tank"
  },
  {
    "path": "electrical.switches.bank.144.4.state",
    "name": "?"
  },
  {
    "path": "electrical.switches.bank.144.5.state",
    "name": "?"
  },
  {
    "path": "electrical.switches.bank.144.6.state",
    "name": "?"
  },
  {
    "path": "electrical.switches.bank.144.7.state",
    "name": "?"
  },
  {
    "path": "electrical.switches.bank.144.8.state",
    "name": "?"
  },
  {
    "path": "electrical.switches.bank.144.9.state",
    "name": "?"
  },
  {
    "path": "electrical.switches.bank.144.10.state",
    "name": "Bilge Blower"
  },
  {
    "path": "electrical.switches.bank.144.11.state",
    "name": "Nav Lights"
  },
  {
    "path": "electrical.switches.bank.144.12.state",
    "name": "Washdown"
  }
])

const handleError = (error: Error): string => {
  return `Error: ${error.message}`
}
</script>

<template>
  <div class="home">
    <ErrorHandler :fallback="handleError">
      <StatusBarComponent />
    </ErrorHandler>

    <div class="gauge-box">
      <ErrorHandler :fallback="handleError">
        <GaugesComponent />
      </ErrorHandler>
    </div>

    <div class="switch-box">
      <ErrorHandler v-for="switchItem in paths" :key="switchItem.path" :fallback="handleError">
        <ToggleSwitch :path="switchItem.path" :name="switchItem.name" />
      </ErrorHandler>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
}

.gauge-box {
  display: grid;
  height: 50vh;
}

.switch-box {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 2;
  background-color: #000;
  height: 40vh;
  color: #fff;
}

.status-box {
  height: 10vw;
}
</style>