import * as THREE from "three";
import { OrbitControls } from "./three.js-r144/examples/jsm/controls/OrbitControls.js";

export const IDs = {
  CONTAINER: "container",
  ROUTE_CONTAINER: "route-container",
  ROUTES: "routes",
  SCRIPT: "container-script",
  CONTROLS: "control-container",
  MENU_SHOW: "menu-show",
};

/**
 * 一些通用操作
 * @param width 宽度
 * @param height 高度
 * @param showAxesHelper 是否显示坐标轴辅助线
 * @param disableAmbient 是否不创建环境光
 * @param disablePointLight 是否不创建点光源
 * @param disableRender 是否不使用默认 render
 * @param cameraPosition 相机配置 camera.position.set(x, y, z)
 * @param cameraLookAt 相机配置 camera.lookAt(x, y, z)
 * @returns
 */
export const initThree = ({
  width = window.innerWidth,
  height = window.innerHeight,
  showAxesHelper = true,
  disableAmbient = false,
  disablePointLight = false,
  disableRender = false,
  cameraPosition = { x: 200, y: 200, z: 200 },
  cameraLookAt = { x: 0, y: 0, z: 0 },
} = {}) => {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建环境光
  let ambient;
  if (!disableAmbient) {
    ambient = new THREE.AmbientLight("#ffffff", 0.5);
    // 添加到场景
    scene.add(ambient);
  }

  // 创建点光源
  let point;
  if (!disablePointLight) {
    point = new THREE.PointLight("#ffffff", 0.4);
    point.position.set(200, 300, 400);
    // 添加到场景
    scene.add(point);
  }

  // 创建一个透视相机
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);

  // 创建一个 WebGL 渲染器
  const renderer = new THREE.WebGLRenderer();
  // 渲染的宽高，px
  renderer.setSize(width, height);

  // 轨道控制器，用于鼠标控制
  const controls = new OrbitControls(camera, renderer.domElement);
  // 控制器惯性，必须在渲染函数中调用 update()
  controls.enableDamping = true;
  controls.update();

  // 添加坐标轴辅助器
  let axesHelper;
  if (showAxesHelper) {
    axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
  }

  // 渲染场景
  function render() {
    // 渲染下一帧调用的函数
    requestAnimationFrame(render);
    // controls 设置惯性必须调用 update()
    controls.update();
    renderer.render(scene, camera);
  }

  if (!disableRender) {
    render();
  }

  // 页面大小发生改变触发
  window.addEventListener("resize", () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // 更新摄像机宽高比
    camera.aspect = newWidth / newHeight;
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix();

    // 更新渲染器
    renderer.setSize(newWidth, newHeight);
    // 设置渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  // 挂载到 HTML 元素上
  const container = document.getElementById(IDs.CONTAINER);
  const canvasElement = renderer.domElement;
  container.appendChild(canvasElement);

  return { scene, ambient, point, camera, renderer, controls, axesHelper, render };
};
