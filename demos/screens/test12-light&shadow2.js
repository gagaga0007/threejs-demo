import * as THREE from "three";
import * as dat from "dat.gui";
import { initThree } from "../core/model.js";

/**
 * 光源、阴影 - 聚光灯
 */
export default () => {
  const { scene, renderer } = initThree({
    disablePointLight: true,
    cameraPosition: { x: 0, y: 0, z: 10 },
  });

  // 基础网格材质
  const material = new THREE.MeshStandardMaterial();

  // 创建聚光灯
  const spotLight = new THREE.SpotLight("#ffffff", 0.5);
  spotLight.position.set(10, 10, 10);
  scene.add(spotLight);

  // 创建球体
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.position.set(0, -1, 0);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // 渲染器开启阴影计算
  renderer.shadowMap.enabled = true;
  // 光照设置投射阴影
  spotLight.castShadow = true;
  // 物体设置投射阴影（上方球体）
  sphere.castShadow = true;
  // 物体设置接收阴影（下方平面）
  plane.receiveShadow = true;

  // 阴影贴图模糊度
  spotLight.shadow.radius = 20;
  // 阴影贴图分辨率
  spotLight.shadow.mapSize.set(2048, 2048);
  // 聚光灯聚焦目标
  spotLight.target = sphere;
  // 聚光灯聚焦弧度范围
  spotLight.angle = Math.PI / 6;
  // 光源衰减距离
  spotLight.distance = 0;
  // 光源半影（边缘）衰减效果 0 ~ 1
  spotLight.penumbra = 0;
  // 光源根据衰减距离的衰减量，需要设置 distance
  spotLight.decay = 1;
  // 设置透视相机属性
  spotLight.shadow.camera.near = 0.5; // 近光
  spotLight.shadow.camera.far = 500; // 远光
  // spotLight.shadow.camera.fov = 3; // 角度

  // 创建 gui
  const gui = new dat.GUI();
  gui.add(sphere.position, "x").min(-5).max(5).step(0.1).name("球体位置 x");
  gui
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.1)
    .name("聚焦弧度");
  gui.add(spotLight, "penumbra").min(0).max(1).step(0.01).name("边缘衰减");
  gui.add(spotLight, "distance").min(0).max(100).step(0.01).name("衰减距离");
  gui.add(spotLight, "decay").min(0).max(5).step(0.01).name("距离衰减量");

  return {
    // 销毁 gui 弹层
    beforeDestroy: () => gui.destroy(),
    scene,
    renderer,
  };
};
