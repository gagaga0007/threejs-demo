import * as THREE from "three";
import { initThree } from "./model.js";

/**
 * 画线，执行后应当出现一个白色向上的折线
 */
export default () => {
  const { scene } = initThree({
    showAxesHelper: false,
    cameraPosition: { x: 0, y: 0, z: 100 },
  });

  // 创建基础材质对象
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
  });

  // 创建带有一些顶点的几何体
  const points = [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0), new THREE.Vector3(10, 0, 0)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);

  scene.add(line);
};
