import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 利用缓冲区生成一个由两个三角形组成的矩形
 */
export default () => {
  const { scene, renderer } = initThree();

  // 创建基础材质对象
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
  });

  // 创建缓冲区几何体
  const geometry = new THREE.BufferGeometry();

  // 顶点，每一个元素是一个坐标，每三坐标确定一个顶点，每三个顶点组成一个三角形，两个三角形组合成一个矩形
  const vertices = new Float32Array([
    //
    -10.0, -10.0, 10.0,
    //
    10.0, -10.0, 10.0,
    //
    10.0, 10.0, 10.0,
    //
    10.0, 10.0, 10.0,
    //
    -10.0, 10.0, 10.0,
    //
    -10.0, -10.0, 10.0,
  ]);

  // 设置每三个一组
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return { scene, renderer };
};
