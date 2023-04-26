import * as THREE from "three";
import { initThree } from "../core/model.js";
import rawVertexShader from "../core/shader/raw/vertex.js";
import rawFragmentShader from "../core/shader/raw/fragment.js";

/**
 * 着色器 - 原始着色器材质
 * 具体设置见引入的两个着色器代码
 * 文档 https://threejs.org/docs/index.html?q=shaderma#api/zh/materials/ShaderMaterial
 */
export default () => {
  const { scene, renderer, camera, controls } = initThree({
    cameraPosition: { x: 2, y: 2, z: 2 },
    disableRender: true,
  });

  // 导入材质
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/images/particles/flag.jpeg");

  // 创建原始着色器材质
  const rawShaderMaterial = new THREE.RawShaderMaterial({
    // 顶点着色器
    vertexShader: rawVertexShader, // glsl 代码
    // 片元着色器
    fragmentShader: rawFragmentShader, // glsl 代码

    // 定义 GLSL 自定义全局变量
    // https://threejs.org/docs/index.html#api/zh/core/Uniform
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
    },

    side: THREE.DoubleSide,
  });

  // 创建平面
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), rawShaderMaterial);
  scene.add(floor);

  const clock = new THREE.Clock();
  const render = () => {
    // 随时间摆动
    const time = clock.getElapsedTime();
    rawShaderMaterial.uniforms.uTime.value = time; // 设置自定义 uTime，rawVertexShader 中获取

    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  render();
};
