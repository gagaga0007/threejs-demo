import * as THREE from 'three'
import gsap from 'gsap'
import vertex from '@/core/shaders/light-wall/vertex'
import fragment from '@/core/shaders/light-wall/fragment'

export const createLightWall = (radius = 5, length = 2, position = { x: 0, z: 0 }) => {
  const geometry = new THREE.CylinderGeometry(radius, radius, 2, 32, 1, true)
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(position.x, 1, position.z)
  mesh.geometry.computeBoundingBox()

  // @ts-ignore
  const { min, max } = mesh.geometry.boundingBox
  // 获取物体的高度差
  const uHeight = max.y - min.y
  material.uniforms.uHeight = {
    value: uHeight
  }

  // 光墙动画
  gsap.to(mesh.scale, {
    x: length,
    z: length,
    duration: 1,
    repeat: -1,
    yoyo: true
  })

  const remove = () => {
    mesh.remove()
    mesh.removeFromParent()
    mesh.geometry.dispose()
    mesh.material.dispose()
  }

  return { mesh, remove }
}
