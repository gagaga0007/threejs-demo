import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 设置场景背景、环境纹理
 */
export default () => {
  const { scene } = initThree({
    cameraPosition: { x: 15, y: 15, z: 15 },
  });

  // cube 贴图加载器
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envMapTexture = cubeTextureLoader.load([
    "./assets/images/env/1/px.jpg",
    "./assets/images/env/1/nx.jpg",
    "./assets/images/env/1/py.jpg",
    "./assets/images/env/1/ny.jpg",
    "./assets/images/env/1/pz.jpg",
    "./assets/images/env/1/nz.jpg",
  ]);

  // 场景添加贴图为背景
  scene.background = envMapTexture;
  // 给场景中所有物体添加默认环境纹理
  scene.environment = envMapTexture;

  // 创建球体和材质
  const sphereGeometry = new THREE.SphereGeometry(3, 20, 20);
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.1,
    // 如果不设置，则使用场景设置的默认环境纹理
    // envMap: envMapTexture, // 环境纹理
  });
  const sphere = new THREE.Mesh(sphereGeometry, material);
  scene.add(sphere);
};
