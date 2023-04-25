import * as THREE from "three";
import { IDs, initThree } from "../core/model.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default () => {
  const container = document.getElementById(IDs.CONTAINER);
  container.innerHTML += '<link rel="stylesheet" href="../assets/css/test26.css" />';

  const { scene, renderer, camera } = initThree({
    disableRender: true,
    disableControls: true,
    cameraPosition: { x: 20, y: 20, z: 20 },
    onWindowResize,
  });

  // 导入材质
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("../assets/images/earth/earth_atmos_2048.jpg");
  const earthNormalTexture = textureLoader.load("../assets/images/earth/earth_normal_2048.jpg");
  const earthSpecularTexture = textureLoader.load("../assets/images/earth/earth_specular_2048.jpg");
  const moonTexture = textureLoader.load("../assets/images/earth/moon_1024.jpg");

  // 创建球体和材质 - 地球
  const earthGeometry = new THREE.SphereGeometry(5, 16, 16);
  const earthMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: earthTexture,
    specularMap: earthSpecularTexture,
    normalMap: earthNormalTexture,
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // 创建球体和材质 - 月球
  const moonGeometry = new THREE.SphereGeometry(1, 16, 16);
  const moonMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: moonTexture,
  });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(10, 10, 10);
  scene.add(moon);

  // 添加标签 - 地球
  const earthDiv = document.createElement("div");
  earthDiv.innerHTML = "EARTH";
  // 实例化 div - 地球
  const earthLabel = new CSS2DObject(earthDiv);
  earthLabel.position.set(0, 6, 0); // 注意：此处的位置是根据其父级元素确定的，如此处是相对于地球的位置
  earth.add(earthLabel);

  // 添加标签 - 月球
  const moonDiv = document.createElement("div");
  moonDiv.innerHTML = "MOON";
  // 实例化 div - 月球
  const moonLabel = new CSS2DObject(moonDiv);
  moonLabel.position.set(0, 2, 0);
  moon.add(moonLabel);

  // 添加标签 - 亚洲
  const asiaDiv = document.createElement("div");
  asiaDiv.className = "hidden";
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
  labelRenderer.domElement.style.color = "#ffffff";
  labelRenderer.domElement.style.fontWeight = "bold";
  labelRenderer.domElement.style.fontSize = 24;
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
    earth.rotation.y = time * Math.PI * 0.2;
    moon.rotation.y = time * Math.PI * 0.7;
    moon.position.set(Math.sin(time) * 10, 0, Math.cos(time) * 10);

    // 检测射线碰撞
    const asiaPosition = asiaLabel.position.clone();
    asiaPosition.project(camera); // 将坐标投影到相机坐标空间
    raycaster.setFromCamera(asiaPosition, camera);
    // 检测射线碰撞到的物体
    const intersects = raycaster.intersectObjects(scene.children, true);
    // 如果没有碰撞
    if (intersects.length === 0) {
      asiaLabel.element.classList.remove("hidden");
      asiaLabel.element.classList.add("visible");
    } else {
      console.log(intersects);
      asiaLabel.element.classList.remove("visible");
      asiaLabel.element.classList.add("hidden");
    }

    // 渲染标签
    labelRenderer.render(scene, camera);

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();
};
