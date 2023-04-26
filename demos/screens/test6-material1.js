import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 材质 - 纹理的一些属性
 * MeshBasicMaterial 基础材质，不受光照影响
 */
export default () => {
  const { scene } = initThree();

  // 导入贴图
  const textureLoader = new THREE.TextureLoader();
  const texture1 = textureLoader.load("./assets/images/door/color.jpg");
  // 偏移 0 ~ 1
  // texture1.offset.x = 0.5;
  // texture1.offset.y = 0.5;
  texture1.offset.set(0.3, 0.5);
  // 旋转
  texture1.rotation = Math.PI / 4;
  // 设置原点
  texture1.center.set(0.5, 0.5);
  // 设置纹理重复
  texture1.repeat.set(2, 3); // x 轴两次，y 轴三次
  // 设置纹理重复模式
  texture1.wrapS = THREE.MirroredRepeatWrapping; // x 轴，镜像重复
  texture1.wrapT = THREE.RepeatWrapping; // y 轴，无穷重复

  // 添加物体
  const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);

  // 添加材质
  const basicMaterial = new THREE.MeshBasicMaterial({
    map: texture1, // 纹理
  });

  const cube = new THREE.Mesh(cubeGeometry, basicMaterial);

  scene.add(cube);
};
