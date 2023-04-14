import * as THREE from "three";
import { initThree } from "./model.js";

/**
 * 点、点材质
 */
export default () => {
  const { scene } = initThree();

  // 创建球几何体
  const sphereGeometry = new THREE.SphereGeometry(100, 30, 30);
  // 创建点材质
  const pointsMaterial = new THREE.PointsMaterial({ color: "#ff0000", size: 5.0 });
  // 创建点
  const points = new THREE.Points(sphereGeometry, pointsMaterial);
  scene.add(points);

  // 导入并纹理
  const textureLoader = new THREE.TextureLoader();
  const pointTexture = textureLoader.load("./assets/particles/2.png");

  // 随相机深度而衰减
  pointsMaterial.sizeAttenuation = true;
  // 使用纹理
  pointsMaterial.transparent = true;
  pointsMaterial.map = pointTexture;
  pointsMaterial.alphaMap = pointTexture;

  pointsMaterial.depthWrite = false;
  pointsMaterial.blending = THREE.AdditiveBlending;
};
