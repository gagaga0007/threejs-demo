import * as THREE from "three";
import { initThree } from "../core/model.js";
import rawVertexShader from "../core/shader/raw/vertex2.js";
import rawFragmentShader from "../core/shader/raw/fragment2.js";

/**
 * 着色器 - 各种效果，见引入的文件
 * 各种着色器效果 - https://thebookofshaders.com/?lan=ch
 */
export default () => {
  const { scene, renderer, camera, controls } = initThree({
    cameraPosition: { x: 2, y: 2, z: 2 },
    disableRender: true,
  });

  // 创建原始着色器材质
  const rawShaderMaterial = new THREE.RawShaderMaterial({
    // 顶点着色器
    vertexShader: rawVertexShader, // glsl 代码
    // 片元着色器
    fragmentShader: rawFragmentShader, // glsl 代码

    uniforms: {
      uTime: { value: 0 },
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
