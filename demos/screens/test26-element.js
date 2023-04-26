import * as THREE from "three";
import { IDs, initThree } from "../core/model.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default () => {
  const container = document.getElementById(IDs.CONTAINER);
  container.innerHTML += '<link rel="stylesheet" href="./assets/css/test26.css" />';

  const { scene, renderer, camera } = initThree({
    disableRender: true,
    disableControls: true,
    cameraPosition: { x: 0, y: 10, z: -25 },
    onWindowResize,
  });

  // 导入材质
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("./assets/images/earth/earth_atmos_2048.jpg");
  const moonTexture = textureLoader.load("./assets/images/earth/moon_1024.jpg");

  // 创建球体和材质 - 地球
  const earthGeometry = new THREE.SphereGeometry(5, 20, 20);
  const earthMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: earthTexture,
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // 创建球体和材质 - 月球
  const moonGeometry = new THREE.SphereGeometry(1, 20, 20);
  const moonMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: moonTexture,
  });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  scene.add(moon);

  // 添加标签 - 地球
  const earthDiv = document.createElement("div");
  earthDiv.className = "label";
  earthDiv.innerHTML = "EARTH";
  // 实例化 div - 地球
  const earthLabel = new CSS2DObject(earthDiv);
  earthLabel.position.set(0, 5, 0); // 注意：此处的位置是根据其父级元素确定的，如此处是相对于地球的位置
  earth.add(earthLabel);

  // 添加标签 - 月球
  const moonDiv = document.createElement("div");
  moonDiv.className = "label";
  moonDiv.innerHTML = "MOON";
  // 实例化 div - 月球
  const moonLabel = new CSS2DObject(moonDiv);
  moonLabel.position.set(0, 1, 0);
  moon.add(moonLabel);

  // 添加标签 - 亚洲
  const asiaDiv = document.createElement("div");
  asiaDiv.className = "label hidden";
  asiaDiv.innerHTML = "ASIA";
  // 实例化 div - 地球
  const asiaLabel = new CSS2DObject(asiaDiv);
  asiaLabel.position.set(-1, 2, -5);
  earth.add(asiaLabel);

  // 实例化 CSS2DObject（渲染出来）并挂载到页面
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "fixed";
  labelRenderer.domElement.style.left = 0;
  labelRenderer.domElement.style.top = 0;
  labelRenderer.domElement.style.zIndex = 10;
  container.appendChild(labelRenderer.domElement);

  // 创建射线
  const raycaster = new THREE.Raycaster();

  // 轨道控制器，此处传入的是 labelRender（labelRender 覆盖在在了 canvas 上方）
  const controls = new OrbitControls(camera, labelRenderer.domElement);
  controls.enableDamping = true;
  controls.update();

  // 自定义视口改变时的函数
  function onWindowResize() {
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();
    moon.position.set(Math.sin(time) * 10, 0, Math.cos(time) * 10);

    const asiaLabelPosition = asiaLabel.position.clone();
    // 计算标签和摄像机的距离
    const asiaLabelDistance = asiaLabelPosition.distanceTo(camera.position);
    // 检测射线碰撞
    asiaLabelPosition.project(camera); // 将坐标投影到相机坐标空间
    raycaster.setFromCamera(asiaLabelPosition, camera);
    // 检测射线碰撞到的物体
    const asiaLabelIntersects = raycaster.intersectObjects(scene.children, true);
    // 如果没有碰撞则显示标签
    if (asiaLabelIntersects.length === 0) {
      asiaLabel.element.classList.remove("hidden");
      asiaLabel.element.classList.add("visible");
    } else {
      // 判断距离最近的遮挡物体的距离是否小于标签到摄像机距离，小于则说明球挡住了标签，则隐藏
      const minDistance = asiaLabelIntersects[0].distance;
      if (minDistance < asiaLabelDistance) {
        asiaLabel.element.classList.remove("visible");
        asiaLabel.element.classList.add("hidden");
      } else {
        asiaLabel.element.classList.remove("hidden");
        asiaLabel.element.classList.add("visible");
      }
    }

    // 渲染标签
    labelRenderer.render(scene, camera);

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();
};
