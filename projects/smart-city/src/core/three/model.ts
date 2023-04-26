import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// --- 相机 ---
export const camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerWidth, 1, 5000)
camera.position.set(8, 8, 10)

// --- 辅助坐标轴 ---
export const axesHelper = new THREE.AxesHelper(5)

// --- 渲染器 ---
export const renderer = new THREE.WebGLRenderer({
  antialias: true // 抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// --- 控制器 ---
export const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true
// 设置自动旋转
// controls.autoRotate = true

// --- 场景 ---
export const scene = new THREE.Scene()
// 设置场景贴图
const textureCubeLoader = new THREE.CubeTextureLoader().setPath('../public/textures/')
const textureCube = textureCubeLoader.load(['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'])
scene.background = textureCube
scene.environment = textureCube

// --- gui ---
export const gui = new dat.GUI()

// --- render ---
export const clock = new THREE.Clock()
export const animate = () => {
  controls.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// --- 初始化操作 ---
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
})
