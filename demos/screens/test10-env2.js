import * as THREE from "three";
import { initThree } from "../core/model.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * 设置 HDR 格式的场景背景和环境纹理
 */
export default async () => {
  const { scene, renderer } = initThree({
    cameraPosition: { x: 15, y: 15, z: 15 },
  });

  // 加载 HDR 环境图
  const rgbeLoader = new RGBELoader();
  const texture = await rgbeLoader.loadAsync("./assets/images/hdr/002.hdr");
  // 设置映射模式
  // 默认值为 UVMapping，使用网格坐标进行映射
  // EquirectangularReflectionMapping，使用等距圆柱投影的环境贴图（经纬线映射贴图）（可以理解为像全景拍照得到的照片一样，一张把环境图展开的图片）
  texture.mapping = THREE.EquirectangularReflectionMapping;

  // 场景添加贴图为背景
  scene.background = texture;
  // 给场景中所有物体添加默认环境纹理
  scene.environment = texture;

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

  return { scene, renderer };
};
