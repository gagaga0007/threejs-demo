import * as THREE from "three";
import * as dat from "dat.gui";
import { initThree } from "../core/model.js";
import rawVertexShader from "../core/shader/raw2/vertex.js";
import rawFragmentShader from "../core/shader/raw2/fragment.js";

/**
 * 着色器 - 各种效果，见引入的文件
 * 本文件效果可通过 note/test22-note.md 查看效果
 * 各种着色器效果 - https://thebookofshaders.com/?lan=ch
 */
export default () => {
  const { scene, renderer, camera, controls } = initThree({
    cameraPosition: { x: 2, y: 2, z: 2 },
    disableRender: true,
  });

  const params = {
    uScale: 0.1,
  };

  // 创建原始着色器材质
  const rawShaderMaterial = new THREE.RawShaderMaterial({
    // 顶点着色器
    vertexShader: rawVertexShader, // glsl 代码
    // 片元着色器
    fragmentShader: rawFragmentShader, // glsl 代码

    uniforms: {
      // 时间
      uTime: { value: 0 },
      // 波浪幅度
      uScale: { value: params.uScale },
    },

    side: THREE.DoubleSide,
    transparent: true,
  });

  // 创建平面
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), rawShaderMaterial);
  scene.add(floor);

  // gui
  const gui = new dat.GUI();
  gui
    .add(params, "uScale")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((value) => {
      rawShaderMaterial.uniforms.uScale.value = value;
    });

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

  return {
    beforeDestroy: () => gui.destroy(),
  };
};
