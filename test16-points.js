import * as THREE from "three";
import { initThree } from "./model.js";

/**
 * 点、点材质
 */
export default () => {
  const { scene } = initThree();

  // 创建球几何体
  const sphereGeometry = new THREE.SphereGeometry(100, 20, 20);
  // 创建点材质
  const pointsMaterial = new THREE.PointsMaterial({ color: "#ff0000", size: 3.0 });
  // 创建点
  const points = new THREE.Points(sphereGeometry, pointsMaterial);
  scene.add(points);
};
