import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { defaultModel } from '../model'
import { modifyCityMaterial } from '@/core/three/modify/modifyCityMaterial'
import { createFlyLine } from '@/core/three/mesh/fly-line'
import { createFlyLineShader } from '@/core/three/mesh/fly-line-shader'
import { createMeshLine } from '@/core/three/mesh/mesh-line'
import { createLightWall } from '@/core/three/mesh/light-wall'
import { createLightRadar } from '@/core/three/mesh/light-rader'
import { createAlarmSprite } from '@/core/three/mesh/alarm-sprite'

export const createCity = (init = true) => {
  const removeFns: Function[] = []

  const { scene } = defaultModel

  // 添加模型
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('../../../../model/city.glb', (gltf) => {
    gltf.scene.traverse((item) => {
      if (item.type === 'Mesh') {
        // @ts-ignore
        item.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#0c0e33')
        })
        modifyCityMaterial(item)

        // 给建筑物添加线框
        if (item.name == 'Layerbuildings') {
          // @ts-ignore
          const meshLine = createMeshLine(item.geometry)
          const size = item.scale.x
          meshLine.mesh.scale.set(size, size, size)
          scene.add(meshLine.mesh)
        }
      }
    })
    scene.add(gltf.scene)

    if (!init) return

    // 添加飞线
    const flyLine = createFlyLine()
    scene.add(flyLine.mesh)
    removeFns.push(flyLine.remove)

    // 添加着色器飞线
    const flyLineShader = createFlyLineShader()
    scene.add(flyLineShader.mesh)
    removeFns.push(flyLineShader.remove)

    // 添加光墙
    const lightWall = createLightWall()
    scene.add(lightWall.mesh)
    removeFns.push(lightWall.remove)

    // 添加雷达
    const lightRadar = createLightRadar()
    scene.add(lightRadar.mesh)
    removeFns.push(lightRadar.remove)

    // 添加警告标识
    const alarmSprite = createAlarmSprite()
    scene.add(alarmSprite.mesh)
    alarmSprite.onClick(function (e: any) {
      console.log('警告', e)
    })
    removeFns.push(alarmSprite.remove)
  })

  return {
    remove: () => {
      removeFns.forEach((v) => v())
    }
  }
}
