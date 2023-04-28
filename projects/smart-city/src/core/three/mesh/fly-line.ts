import * as THREE from 'three'
import gsap from 'gsap'

/**
 * 生成飞线
 */
export const createFlyLine = () => {
  const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 0), new THREE.Vector3(10, 0, 0)]
  // 1、创建曲线
  const lineCurve = new THREE.CatmullRomCurve3(linePoints)
  // 2、根据曲线生成管道几何体
  const geometry = new THREE.TubeGeometry(lineCurve, 100, 0.4, 2, false)
  // 3、设置飞线材质
  // 创建纹理
  const textLoader = new THREE.TextureLoader()
  const texture = textLoader.load('./textures/z_11.png')
  texture.repeat.set(1, 2)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.MirroredRepeatWrapping

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })

  // 4、创建飞线物体
  const mesh = new THREE.Mesh(geometry, material)

  // 5、创建飞线动画
  gsap.to(texture.offset, {
    x: -1,
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
