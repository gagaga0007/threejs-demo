import * as THREE from "three";
import { initThree } from "./model.js";

/**
 * 利用缓冲区生成数个随机三角形
 */
export default () => {
  const { scene } = initThree();

  // 生成 10 个三角形
  for (let i = 0; i <= 10; i++) {
    // 创建缓冲区几何体
    const geometry = new THREE.BufferGeometry();
    // 缓冲区设置 9 个值（三个坐标确定一个顶点，三个顶点组成一个三角形）
    const positionArray = new Float32Array(9);
    for (let j = 0; j < 9; j++) {
      // 生成 -100 到 100 之间随机坐标（Math.random() * (MAX - MIN + 1) + MIN）
      positionArray[j] = Math.random() * (100 - -100 + 1) + -100;
    }
    // 设置每三个一组
    geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));

    // 设置随机颜色
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);

    // 添加到场景
    scene.add(cube);
  }
};
