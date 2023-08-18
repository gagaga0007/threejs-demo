import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const cameraOptions = {
  fov: 75,
  near: 1,
  far: 5000,
  x: 8,
  y: 8,
  z: 10
}

const axesHelperSize = 50

class DefaultModel {
  camera: THREE.PerspectiveCamera
  axesHelper: THREE.AxesHelper
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  scene: THREE.Scene
  clock: THREE.Clock

  constructor() {
    const { fov, near, far } = cameraOptions

    // 相机
    this.camera = new THREE.PerspectiveCamera(fov, window.innerHeight / window.innerWidth, near, far)
    // 辅助坐标轴
    this.axesHelper = new THREE.AxesHelper(axesHelperSize)
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true // 抗锯齿
    })
    // 控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // 场景
    this.scene = new THREE.Scene()
    // 时间
    this.clock = new THREE.Clock()
  }

  initModel = () => {
    // 相机
    const { x, y, z } = cameraOptions
    this.camera.position.set(x, y, z)

    // 渲染器
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true

    // 设置控制器阻尼
    this.controls.enableDamping = true
    // 设置控制器自动旋转
    // this.controls.autoRotate = true

    // 设置场景贴图
    const textureCubeLoader = new THREE.CubeTextureLoader().setPath('../textures/')
    const textureCube = textureCubeLoader.load(['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'])
    this.scene.background = textureCube
    this.scene.environment = textureCube

    // --- 初始化操作 ---
    // 更新摄像头
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    // 监听屏幕大小改变的变化，设置渲染的尺寸
    window.addEventListener('resize', () => {
      // 更新摄像头
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      // 更新渲染器
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      // 设置渲染器的像素比例
      this.renderer.setPixelRatio(window.devicePixelRatio)
    })
  }

  // 动画
  animate = () => {
    this.controls.update()
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }

  // 销毁方法
  removeThreeDefault = () => {
    this.axesHelper.dispose()
    this.controls.dispose()
    this.renderer.dispose()
  }
}

export const defaultModel = new DefaultModel()
