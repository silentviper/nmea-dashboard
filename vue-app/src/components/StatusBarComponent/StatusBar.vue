<script lang="ts" setup>
import { ref } from 'vue'
import LogoComponent from '@/components/Logo.vue'
import TimeComponent from '@/components/TimeComponent/TimeComponent.vue'
import GPSComponent from '@/components/GPSComponent/GPSComponent.vue'

const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div class="status-bar">
    <div class="gps-box">
      <GPSComponent />
    </div>
    <div class="logo-box">
      <LogoComponent></LogoComponent>
    </div>
    <div class="time-box">
      <input type="button" value="Reload page" @click="reloadPage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1rem;
  
  .gps-box {
    justify-self: start;
  }
  
  .logo-box {
    text-align: center;
  }
  
  .time-box {
    justify-self: end;
  }
}
</style>