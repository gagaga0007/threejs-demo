import * as THREE from 'three'
import gsap from 'gsap'
import vertex from '@/core/shaders/light-rader/vertex'
import fragment from '@/core/shaders/light-rader/fragment'

export const createLightRadar = (radius = 2, position = { x: 0, z: 0 }, color = '#ff0000') => {
  const geometry = new THREE.PlaneGeometry(radius, radius)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(position.x, 1, position.z)
  mesh.rotation.x = -Math.PI / 2

  gsap.to(material.uniforms.uTime, {
    value: 1,
    duration: 1,
    repeat: -1,
    ease: 'none'
  })

  const remove = () => {
    mesh.remove()
    mesh.removeFromParent()
    mesh.geometry.dispose()
    mesh.material.dispose()
  }

  return { mesh, remove }
}
