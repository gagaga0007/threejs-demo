<template>
  <div class="scene" ref="sceneRef" />
  <div id="bigScreen">
    <div class="header">智慧城市管理系统平台</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent" v-for="(item, key) in dataInfo" :key="key">
          <h3>
            <span>{{ item.name }}</span>
          </h3>
          <h1>
            <img src="../assets/bg/bar.svg" class="icon" alt="" />
            <span>{{ item.number }}（{{ item.unit }}）</span>
          </h1>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent list">
          <h3>
            <span>事件列表</span>
          </h3>
          <ul>
            <li
              v-for="(item, i) in eventList"
              :key="item + i"
              :class="{ active: currentActive == i }"
              @click="onEventClick(i)"
            >
              <h1>
                <img class="icon" :src="options.find((v) => v.value === item.type)?.texture" alt="" />
                <span> {{ item.name }} </span>
              </h1>
              <p>{{ item.description }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSmartCityInfo, getSmartCityList } from '@/core/api'
import { alarmTypeOptions } from '@/core/options'
import { createAlarmSprite } from '@/core/three/mesh/alarm-sprite'
import { createCity } from '@/core/three/mesh/city'
import { createFlyLineShader } from '@/core/three/mesh/fly-line-shader'
import { createLightRadar } from '@/core/three/mesh/light-rader'
import { createLightWall } from '@/core/three/mesh/light-wall'
import { defaultModel } from '@/core/three/model'
import type { DataProps } from '@/core/type'
import gsap from 'gsap'
import * as THREE from 'three'
import { onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue'

const options = alarmTypeOptions.map((v) => ({ ...v, texture: `src/assets/tag/${v.value}.png` }))

const sceneRef = ref<any>(null)
const removeFn = ref<Function>()
const currentActive = ref(null)
const eventList = ref<any[]>([])
const dataInfo = reactive({
  iot: {} as DataProps,
  event: {} as DataProps,
  power: {} as DataProps,
  test: {} as DataProps
})

onMounted(() => {
  getInfo()
  getEvents()

  const fn = createCity(false)
  removeFn.value = fn.remove

  const { camera, axesHelper, renderer, scene, animate, initModel } = defaultModel

  initModel()

  scene.add(camera)
  scene.add(axesHelper)
  sceneRef.value.appendChild(renderer.domElement)
  animate()
})

onUnmounted(() => {
  removeFn.value?.()
})

const getInfo = () => {
  const res = getSmartCityInfo()

  const data = { ...res.data }
  Object.keys(dataInfo).forEach((key: string) => {
    // @ts-ignore
    dataInfo[key] = data[key]

    // @ts-ignore
    gsap.to(dataInfo[key], {
      // @ts-ignore
      number: data[key].number,
      duration: 1
    })
  })
}

const getEvents = () => {
  let res = getSmartCityList()
  eventList.value = res.list
}

const onSpriteClick = (data: any) => {
  currentActive.value = data.i
}

const onEventClick = (i: any) => {
  currentActive.value = i
  onEventToggle(i)
}

const eventListMesh: any[] = []
let mapFn = {
  fire: (position: { x: number; y: number; z: number }, i: number) => {
    const lightWall = createLightWall(1, 2, position)
    // @ts-ignore
    lightWall.eventListIndex = i
    defaultModel.scene.add(lightWall.mesh)
    eventListMesh.push(lightWall)
  },
  safe: (position: { x: number; y: number; z: number }, i: number) => {
    // 生成随机颜色
    const color = new THREE.Color(Math.random(), Math.random(), Math.random()).getHex()
    // 添加着色器飞线
    const flyLineShader = createFlyLineShader(position, color)
    // @ts-ignore
    flyLineShader.eventListIndex = i
    defaultModel.scene.add(flyLineShader.mesh)
    eventListMesh.push(flyLineShader)
  },
  electric: (position: { x: number; y: number; z: number }, i: number) => {
    // 添加雷达
    const lightRadar = createLightRadar(2, position)
    // @ts-ignore
    lightRadar.eventListIndex = i
    defaultModel.scene.add(lightRadar.mesh)
    eventListMesh.push(lightRadar)
  }
}

const onEventToggle = (i: number) => {
  eventListMesh.forEach((item) => {
    item.mesh.visible = item.eventListIndex === i
  })
  const position = {
    x: eventList.value?.[i].position.x / 5 - 10,
    y: 0,
    z: eventList.value?.[i].position.y / 5 - 10
  }
  gsap.to(defaultModel.controls.target, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z
  })
}

watchEffect(() => {
  eventListMesh.forEach((item) => {
    item.remove()
  })
  eventList.value.forEach((item, i) => {
    const position = {
      x: item.position.x / 5 - 10,
      z: item.position.y / 5 - 10
    }
    const alarmSprite = createAlarmSprite(item.type, position)
    alarmSprite.onClick(() => {
      onSpriteClick({ event: item, i })
    })
    // @ts-ignore
    alarmSprite.eventListIndex = i
    eventListMesh.push(alarmSprite)
    defaultModel.scene.add(alarmSprite.mesh)
    // @ts-ignore
    if (mapFn[item.type]) {
      // @ts-ignore
      mapFn[item.type](position, i)
    }
  })
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

#bigScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  height: 5vh;
  background-image: url(@/assets/bg/title.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(226, 226, 255);
  font-size: 1.3rem;
  line-height: 5vh;
}

.main {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 15vw;
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  padding: 1vw 0;
}

.right {
  width: 15vw;
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  padding: 1vw 0;
}

.cityEvent {
  position: relative;
  width: 80%;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
}

.cityEvent::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: '';
  display: block;
}

.cityEvent::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: '';
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.3rem 0.3rem;
  font-size: 0.3rem;
}

h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
}

h1 > div {
  display: flex;
  align-items: center;
}

h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0 0.3rem 0.3rem;
}

.list h1 {
  padding: 0.1rem 0.3rem;
}

.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}

.cityEvent li.active p {
  color: red;
}

ul,
li {
  list-style: none;
}
</style>
