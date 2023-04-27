<template>
  <div class="scene" ref="sceneRef" />
  <button class="button" @click="toBigScreen">跳转大屏</button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { animate, axesHelper, camera, renderer, scene } from '@/core/three/model'
import { createCity } from '@/core/three/mesh/city'
import router from '@/router'

const sceneRef = ref<any>(null)

onMounted(() => {
  createCity()

  scene.add(camera)
  scene.add(axesHelper)
  sceneRef.value.appendChild(renderer.domElement)
  animate()
})

const toBigScreen = () => {
  router.push('/big')
}
</script>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}

.button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  padding: 8px 10px;
  border: 0;
  background-color: rgb(1, 18, 86);
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}
</style>
