import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 点、点材质
 */
export default () => {
  const { scene } = initThree();

  // 创建球几何体
  const sphereGeometry = new THREE.SphereGeometry(100, 30, 30);
  // 创建点材质
  const pointsMaterial = new THREE.PointsMaterial({ size: 5.0 });
  // 创建点
  const points = new THREE.Points(sphereGeometry, pointsMaterial);
  scene.add(points);

  // 导入并纹理
  const textureLoader = new THREE.TextureLoader();
  const pointTexture = textureLoader.load("./assets/images/particles/1.png");

  // —————— 设置材质属性 ——————————
  pointsMaterial.color.set("#ff0000");
  // 随相机深度而衰减，false 则各种点显示一样大
  pointsMaterial.sizeAttenuation = true;
  // 使用纹理
  pointsMaterial.transparent = true;
  pointsMaterial.map = pointTexture;
  pointsMaterial.alphaMap = pointTexture;
  // 渲染此材质是否对深度缓冲区有任何影响
  pointsMaterial.depthWrite = false;
  // 混合模式
  pointsMaterial.blending = THREE.AdditiveBlending;
};
