import { AlarmTypeEnum, alarmTypeOptions } from '@/core/options'
import { defaultModel } from '@/core/three/model'
import * as THREE from 'three'

export const createAlarmSprite = (type = AlarmTypeEnum.FIRE, position = { x: -1.8, z: 3 }, color = '#ffffff') => {
  const textureLoader = new THREE.TextureLoader()

  const options = alarmTypeOptions.map((v) => ({ ...v, texture: `../../../textures/tag/${v.value}.png` }))

  // @ts-ignore
  const map = textureLoader.load(options.find((v) => v.value === type)?.texture)
  const material = new THREE.SpriteMaterial({
    map: map,
    color: color,
    transparent: true,
    depthTest: false
  })

  const mesh = new THREE.Sprite(material)
  // 设置位置
  mesh.position.set(position.x, 5, position.z)

  // 封装点击事件
  const fns: any[] = []

  // 创建射线
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  // 事件的监听
  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)

    raycaster.setFromCamera(mouse, defaultModel.camera)

    // @ts-ignore
    event.mesh = mesh
    // @ts-ignore
    event.alarm = { map, material, mesh, raycaster, mouse }

    const intersects = raycaster.intersectObject(mesh)
    if (intersects.length > 0) {
      fns.forEach((fn) => {
        fn(event)
      })
    }
  })

  const onClick = (event: Function) => {
    fns.push(event)
  }

  const remove = () => {
    mesh.remove()
    mesh.removeFromParent()
    mesh.geometry.dispose()
    mesh.material.dispose()
  }

  return { mesh, onClick, remove }
}
