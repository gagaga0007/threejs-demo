import * as THREE from "three";
import * as dat from "dat.gui";
import { initThree } from "./model.js";

/**
 * 光源、阴影 - 点光源
 */
export default () => {
  const { scene, renderer, controls, camera } = initThree({
    disablePointLight: true,
    disableRender: true,
    cameraPosition: { x: 0, y: 0, z: 10 },
  });

  // 基础网格材质
  const material = new THREE.MeshStandardMaterial();

  // 创建点光源
  const pointLight = new THREE.PointLight("#ff0000", 0.5);
  pointLight.position.set(2, 2, 2);
  scene.add(pointLight);

  // 将点光源具象化（设置一个球体放在光源处）
  const lightBallGeometry = new THREE.SphereGeometry(0.1, 20, 20);
  const basicMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });
  const lightBall = new THREE.Mesh(lightBallGeometry, basicMaterial);
  lightBall.position.set(2, 2, 2);
  lightBall.add(pointLight); // 把光源作为该球体的一部分
  scene.add(lightBall);

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
  pointLight.castShadow = true;
  // 物体设置投射阴影（上方球体）
  sphere.castShadow = true;
  // 物体设置接收阴影（下方平面）
  plane.receiveShadow = true;

  // 阴影贴图模糊度
  pointLight.shadow.radius = 20;
  // 阴影贴图分辨率
  pointLight.shadow.mapSize.set(512, 512);
  // 光源衰减距离
  pointLight.distance = 0;
  // 光源根据衰减距离的衰减量，需要设置 distance
  pointLight.decay = 1;

  // 时钟
  const clock = new THREE.Clock();

  function customRender() {
    // 设置点光源环绕运动效果
    const time = clock.getElapsedTime(); // 获取秒表时间
    lightBall.position.x = Math.sin(time) * 3;
    lightBall.position.y = 2 + Math.sin(time * 3);
    lightBall.position.z = Math.cos(time) * 3;

    // 默认的 render
    // 渲染下一帧调用的函数
    requestAnimationFrame(customRender);
    // controls 设置惯性必须调用 update()
    controls.update();
    renderer.render(scene, camera);
  }

  customRender();

  // 创建 gui
  const gui = new dat.GUI();
  gui.add(sphere.position, "x").min(-5).max(5).step(0.1).name("球体位置 x");
  gui.add(pointLight, "distance").min(0).max(10).step(0.01).name("衰减距离");
  gui.add(pointLight, "decay").min(0).max(5).step(0.01).name("距离衰减量");

  return {
    // 销毁 gui 弹层
    beforeDestroy: () => gui.destroy(),
  };
};
