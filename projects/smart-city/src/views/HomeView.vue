<template>
  <div class="scene" ref="sceneRef" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { animate, axesHelper, camera, renderer, scene } from '@/core/three/model'
import { createCity } from '@/core/three/mesh/city'
const sceneRef = ref<any>(null)

onMounted(() => {
  createCity()

  scene.add(camera)
  scene.add(axesHelper)
  sceneRef.value.appendChild(renderer.domElement)
  animate()
})
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
</style>
