import * as THREE from "three";
import { initThree } from "../model.js";

/**
 * 材质 - 纹理的一些效果、透明纹理、遮挡纹理
 */
export default () => {
  const { scene } = initThree();

  // 导入贴图
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/door/color.jpg");
  const alphaTexture = textureLoader.load("./assets/door/alpha.jpg");
  const aoTexture = textureLoader.load("./assets/door/ambientOcclusion.jpg");

  // 纹理显示效果设置
  // 默认为 LinearFilter，是获取四个最接近的纹素，并在他们之间进行双线性插值（可以理解为比较清晰）
  // 另一个值为 NearestFilter，是使用最接近的纹素的值（可以理解为可以看清像素，比较模糊，但性能稍好）
  // 当一个纹素覆盖大于一个像素时，贴图的采样方式（可以理解为很近的情况下如何采样）
  texture.minFilter = THREE.NearestFilter;
  // 当一个纹素覆盖小于一个像素时，贴图的采样方式（可以理解为很远的情况下如何采样）
  texture.magFilter = THREE.NearestFilter;

  // 添加材质
  const basicMaterial = new THREE.MeshBasicMaterial({
    color: "#ffffff", // 颜色
    transparent: true, // 设置为透明
    opacity: 0.7, // 透明度，需要配合 transparent
    // side: THREE.DoubleSide,

    map: texture, // 纹理
    alphaMap: alphaTexture, // 透明纹理，需要配合 transparent
    aoMap: aoTexture, // 遮挡纹理
    aoMapIntensity: 0.7, // 遮挡强度
  });
  // 渲染哪一面 默认 FrontSide - 前面；BackSide - 背面； DoubleSide - 两面
  basicMaterial.side = THREE.DoubleSide; // 这些属性可以在构建时设置({ xx: xxx })，也可以构建后单独设置 xx.xx = xxx

  // 添加立方体
  const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
  const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
  scene.add(cube);

  // 添加平面
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const plane = new THREE.Mesh(planeGeometry, basicMaterial);
  plane.position.set(150, 0, 0);
  scene.add(plane);
  // 给平面设置第二组 uv，设置上遮挡纹理
  planeGeometry.setAttribute("uv2", new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));
};
