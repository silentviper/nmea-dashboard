<script setup lang="ts">
import { ref } from 'vue'

interface Settings {
  refreshRate: number
  darkMode: boolean
  displayUnits: 'imperial' | 'metric'
  gpsUpdateInterval: number
}

const settings = ref<Settings>({
  refreshRate: 1000,
  darkMode: true,
  displayUnits: 'imperial',
  gpsUpdateInterval: 1000
})

const saveSettings = () => {
  // Save settings to local storage
  localStorage.setItem('dashboard-settings', JSON.stringify(settings.value))
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>
    
    <div class="bg-gray-800 rounded-lg p-6 space-y-6">
      <div class="grid gap-6">
        <div class="flex flex-col">
          <label class="text-sm text-gray-400 mb-2">Refresh Rate (ms)</label>
          <input 
            v-model="settings.refreshRate" 
            type="number" 
            class="bg-gray-700 rounded px-3 py-2"
          >
        </div>
        
        <div class="flex items-center">
          <label class="flex items-center cursor-pointer">
            <input 
              v-model="settings.darkMode" 
              type="checkbox"
              class="form-checkbox text-blue-600"
            >
            <span class="ml-2">Dark Mode</span>
          </label>
        </div>
        
        <div class="flex flex-col">
          <label class="text-sm text-gray-400 mb-2">Display Units</label>
          <select 
            v-model="settings.displayUnits"
            class="bg-gray-700 rounded px-3 py-2"
          >
            <option value="imperial">Imperial</option>
            <option value="metric">Metric</option>
          </select>
        </div>
        
        <div class="flex flex-col">
          <label class="text-sm text-gray-400 mb-2">GPS Update Interval (ms)</label>
          <input 
            v-model="settings.gpsUpdateInterval" 
            type="number" 
            class="bg-gray-700 rounded px-3 py-2"
          >
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <button 
          @click="saveSettings"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>