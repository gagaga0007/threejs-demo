import * as THREE from "three";
import { initThree } from "../model.js";

/**
 * 点、点材质 - 星空效果
 * 素材地址：aigei.com
 */
export default () => {
  const { scene } = initThree();

  // 生成星空效果
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 5000; // 生成数量
  const size = 3; // 定义三个位置为一个顶点
  const minPosition = -200; // 随机最小坐标
  const maxPosition = 200; // 随机最大坐标

  // 设置缓冲区数组
  const positions = new Float32Array(count * size);
  // 设置顶点颜色
  const colors = new Float32Array(count * 3);
  // 设置顶点
  for (let i = 0; i < count * size; i++) {
    // 设置随机坐标
    positions[i] = Math.random() * (maxPosition - minPosition + 1) + minPosition;
    // 设置颜色
    colors[i] = Math.random();
  }
  // 设置属性 - 位置
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, size));
  // 设置属性 - 颜色（* 点材质需要设置 vertexColors 为 true）
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, size));

  // 创建点材质
  const pointsMaterial = new THREE.PointsMaterial({ size: 7.0 });
  // 创建点
  const points = new THREE.Points(particlesGeometry, pointsMaterial);
  scene.add(points);

  // 导入并纹理
  const textureLoader = new THREE.TextureLoader();
  const pointTexture = textureLoader.load("./assets/particles/1.png");

  // —————— 设置材质属性 ——————————
  pointsMaterial.sizeAttenuation = true;
  pointsMaterial.transparent = true;
  pointsMaterial.map = pointTexture;
  pointsMaterial.alphaMap = pointTexture;
  pointsMaterial.depthWrite = false;
  pointsMaterial.blending = THREE.AdditiveBlending;

  // *** 设置启用顶点着色 ***
  pointsMaterial.vertexColors = true;
};
