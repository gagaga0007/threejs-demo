import * as THREE from 'three'
import gsap from 'gsap'
import vertex from '@/core/shaders/fly-line/vertex'
import fragment from '@/core/shaders/fly-line/fragment'

/**
 * 使用着色器生成飞线
 * @param position
 * @param color
 */
export const createFlyLineShader = (position = { x: -10, z: 0 }, color = 0xff0000) => {
  // 1、根据点生成曲线
  const linePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(position.x / 2, 4, position.z / 2),
    new THREE.Vector3(position.x, 0, position.z)
  ]
  // 创建曲线
  const lineCurve = new THREE.CatmullRomCurve3(linePoints)
  const points = lineCurve.getPoints(1000)
  // 2、创建几何顶点
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // 给每一个顶点设置属性
  const aSizeArray = new Float32Array(points.length)
  for (let i = 0; i < aSizeArray.length; i++) {
    aSizeArray[i] = i
  }
  // 设置几何体顶点属性
  geometry.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1))

  // 3、设置着色器材质
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uLength: { value: points.length }
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const mesh = new THREE.Points(geometry, shaderMaterial)

  // 改变uTime来控制动画
  gsap.to(shaderMaterial.uniforms.uTime, {
    value: 1000,
    duration: 2,
    repeat: -1,
    ease: 'none'
  })

  // 销毁事件
  const remove = () => {
    mesh.remove()
    mesh.removeFromParent()
    mesh.geometry.dispose()
    mesh.material.dispose()
  }

  return { mesh, remove }
}
