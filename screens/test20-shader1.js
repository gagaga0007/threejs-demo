import * as THREE from "three";
import { initThree } from "../core/model.js";
import basicVertexShader from "../core/shader/basic/vertex.js";
import basicFragmentShader from "../core/shader/basic/fragment.js";

/**
 * 着色器 - 着色器材质
 */
export default () => {
  const { scene } = initThree();

  const shaderMaterial = new THREE.ShaderMaterial({
    // 顶点着色器
    vertexShader: basicVertexShader,
    // 片元着色器
    fragmentShader: basicFragmentShader,
  });

  // 创建平面
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 64, 64), shaderMaterial);

  scene.add(floor);
};
