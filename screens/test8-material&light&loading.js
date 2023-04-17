import * as THREE from "three";
import { IDs, initThree } from "../core/model.js";

/**
 * 纹理、光源 - 环境光、直线光源、置换纹理、环境纹理、粗糙度、金属度、法线、贴图事件、加载事件
 * 贴图网站 https://www.poliigon.com/textures
 */
export default () => {
  const { scene } = initThree({
    disableAmbient: true,
    disablePointLight: true,
    cameraPosition: { x: 15, y: 15, z: 15 },
  });

  // 环境光
  const light = new THREE.AmbientLight("#ffffff", 0.5);
  scene.add(light);

  // 直线光源
  const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
  scene.add(directionalLight);
  // 直线光源位置
  directionalLight.position.set(5, 10, 10);

  // 加载进度显示
  const loaderProgressDiv = document.createElement("div");
  loaderProgressDiv.style =
    "padding: 8px; background-color: rgba(141, 141, 141, 0.6); border: 1px solid rgba(255, 255, 255, 0.6); color: #ffffff; font-size: 14px; position: absolute; top: 8px; right: 8px;";
  const container = document.getElementById(IDs.CONTAINER);
  container.appendChild(loaderProgressDiv);

  // 加载管理器
  const loadingManager = new THREE.LoadingManager(
    () => {
      console.log("通过 textureLoader 加载的资源全部加载完成");
    },
    (url, loadedNum, totalNum) => {
      console.log(`加载中: ${url}, 已加载: ${loadedNum}, 需加载: ${totalNum}`);
      const progress = ((loadedNum / totalNum) * 100).toFixed(2);
      loaderProgressDiv.innerHTML = `加载进度: ${progress} %`;
    },
    (url) => {
      console.log("加载错误：", url);
    }
  );

  // 贴图加载器
  const textureLoader = new THREE.TextureLoader(loadingManager); // 贴图 loader。使用 loadingManager 管理，用当前 loader 加载的资源都进入传入的加载管理器
  // 整体的平面贴图
  const texture = textureLoader.load(
    "./assets/door/color.jpg",
    () => {
      console.log("color 加载完成");
    },
    (e) => {
      console.log("color 加载中:", e);
    },
    (e) => {
      console.log("color 加载错误:", e);
    }
  );
  // 透明贴图（只保留门的部分）
  const alphaTexture = textureLoader.load("./assets/door/alpha.jpg");
  // 遮挡贴图（门的线条）
  const aoTexture = textureLoader.load("./assets/door/ambientOcclusion.jpg");
  // 置换贴图（门的部分突出）
  const displacementTexture = textureLoader.load("./assets/door/height.jpg");
  // 粗糙度贴图（门左侧合页漫反射）
  const roughnessTexture = textureLoader.load("./assets/door/roughness.jpg");
  // 金属度贴图（门的金属部分）
  const metalnessTexture = textureLoader.load("./assets/door/metalness.jpg");
  // 法线贴图（门在光照下显示的效果）
  const normalTexture = textureLoader.load("./assets/door/normal.jpg");

  // 添加材质
  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff", // 颜色
    transparent: true, // 设置为透明
    side: THREE.DoubleSide,

    map: texture, // 纹理
    alphaMap: alphaTexture, // 透明纹理，需要配合 transparent
    aoMap: aoTexture, // 遮挡纹理
    aoMapIntensity: 0.7, // 遮挡强度
    displacementMap: displacementTexture, // 置换纹理
    // displacementScale: 0.8, // 纹理缩小程度
    roughnessMap: roughnessTexture, // 粗糙度纹理
    roughness: 1, // 粗糙程度 0(镜面反射) ~ 1(漫反射)。若设置了粗糙度纹理，得到的效果则是 纹理的灰度 * 粗糙程度
    metalnessMap: metalnessTexture, // 金属度纹理
    metalness: 1, // 金属感 0(弱) ~ 1(强)。若设置了金属度纹理，得到的效果则是 纹理的灰度 * 金属度
    normalMap: normalTexture, // 法线纹理
  });

  // 添加立方体 (x, y, z, x 宽度分段数, y 宽度分段数, z 宽度分段数)
  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10, 50, 50, 50);
  const cube = new THREE.Mesh(cubeGeometry, material);
  scene.add(cube);

  // 添加平面 (x, y, x 宽度分段数, y 高度分段数)
  const planeGeometry = new THREE.PlaneGeometry(10, 10, 500, 500);
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.position.set(10, 0, 0);
  scene.add(plane);
  // 给平面设置第二组 uv（顶点），设置上遮挡纹理和置换纹理（可以看出门已经凸出来了）
  planeGeometry.setAttribute("uv2", new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));
};
