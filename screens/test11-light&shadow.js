import * as THREE from "three";
import * as dat from "dat.gui";
import { initThree } from "../model.js";

/**
 * 光源、阴影 - 直线光
 * 1、材质要满足对光照有反应（有光照）
 * 2、设置渲染器开启阴影计算 renderer.shadowMap.enabled = true
 * 3、设置光照投射阴影 directionalLight.castShadow = true
 * 4、设置物体投射阴影 sphere.castShadow = true
 * 5、设置物体接收阴影 plane.receiveShadow = true
 */
export default () => {
  const { scene, renderer } = initThree({ disablePointLight: true, cameraPosition: { x: 0, y: 0, z: 10 } });

  // 基础网格材质
  const material = new THREE.MeshStandardMaterial();

  // 创建直线光源
  const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // 创建球体
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.position.set(0, -1, 0);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // 渲染器开启阴影计算
  renderer.shadowMap.enabled = true;
  // 光照设置投射阴影
  directionalLight.castShadow = true;
  // 物体设置投射阴影（上方球体）
  sphere.castShadow = true;
  // 物体设置接收阴影（下方平面）
  plane.receiveShadow = true;
  // 阴影贴图模糊度
  directionalLight.shadow.radius = 20;
  // 阴影贴图分辨率
  directionalLight.shadow.mapSize.set(2048, 2048);
  // 设置平行光投射相机属性
  directionalLight.shadow.camera.near = 0.5; // 近光
  directionalLight.shadow.camera.far = 500; // 远光
  directionalLight.shadow.camera.top = 5;
  directionalLight.shadow.camera.bottom = -5;
  directionalLight.shadow.camera.left = -5;
  directionalLight.shadow.camera.right = 5;

  // 创建 gui
  const gui = new dat.GUI();
  // 调节平行光投射相机 near 属性
  gui
    .add(directionalLight.shadow.camera, "near")
    .min(0)
    .max(20)
    .step(0.1)
    .onChange(() => {
      // 设置完属性需要调用此方法更新相机投影矩阵
      directionalLight.shadow.camera.updateProjectionMatrix();
    })
    .name("相机 near 属性");

  return {
    // 销毁 gui 弹层
    beforeDestroy: () => gui.destroy(),
  };
};
