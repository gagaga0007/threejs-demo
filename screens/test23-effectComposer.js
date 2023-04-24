import * as THREE from "three";
import * as dat from "dat.gui";
import { initThree } from "../core/model.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { DotScreenPass } from "three/addons/postprocessing/DotScreenPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

/**
 * 合成效果
 */
export default () => {
  const { scene, renderer, camera, controls } = initThree({
    disableRender: true,
    cameraPosition: { x: 3, y: 3, z: 3 },
  });

  // 添加 gui
  const gui = new dat.GUI();

  // 纹理加载器
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  // 添加环境纹理
  const envMapTexture = cubeTextureLoader.load([
    "../assets/images/env/0/px.jpg",
    "../assets/images/env/0/nx.jpg",
    "../assets/images/env/0/py.jpg",
    "../assets/images/env/0/ny.jpg",
    "../assets/images/env/0/pz.jpg",
    "../assets/images/env/0/nz.jpg",
  ]);
  scene.background = envMapTexture;
  scene.environment = envMapTexture;

  // 加载模型
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("../assets/models/glTF/DamagedHelmet.gltf", (gltf) => {
    console.log(gltf);
    const mesh = gltf.scene.children[0];
    scene.add(mesh);
  });

  // 创建合成效果器
  const effectComposer = new EffectComposer(renderer);
  effectComposer.setSize(window.innerWidth, window.innerHeight);

  // --- 添加渲染通道 ---
  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  // --- 添加点效果 ---
  const dotScreenPass = new DotScreenPass();
  dotScreenPass.enabled = false; // 禁用点效果
  effectComposer.addPass(dotScreenPass);

  // --- 添加抗锯齿 ---
  const smaaPass = new SMAAPass();
  effectComposer.addPass(smaaPass);

  // --- 添加屏幕闪烁效果 ---
  const glitchPass = new GlitchPass();
  effectComposer.addPass(glitchPass);

  // --- 添加光照效果 ---
  const unrealBloomPass = new UnrealBloomPass();
  effectComposer.addPass(unrealBloomPass);

  // 曝光程度
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  // 光照强度
  unrealBloomPass.strength = 0.3;
  // 光照模糊程度
  unrealBloomPass.radius = 1;
  // 光照收敛程度
  unrealBloomPass.threshold = 0.5;

  // gui 控制光照效果
  const unrealBloomFolder = gui.addFolder("光照选项");
  unrealBloomFolder.add(renderer, "toneMappingExposure").min(0).max(2).step(0.1);
  unrealBloomFolder.add(unrealBloomPass, "strength").min(0).max(2).step(0.1);
  unrealBloomFolder.add(unrealBloomPass, "radius").min(0).max(2).step(0.1);
  unrealBloomFolder.add(unrealBloomPass, "threshold").min(0).max(1).step(0.1);

  // --- 添加着色器渲染通道 ---
  const colorPrams = {
    r: 0,
    g: 0,
    b: 0,
  };
  const shaderPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uColor: { value: new THREE.Color(colorPrams.r, colorPrams.g, colorPrams.b) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      // 当前页面的纹理
      uniform sampler2D tDiffuse;
      uniform vec3 uColor;

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        color.xyz += uColor;
        gl_FragColor = color;
      }
    `,
  });
  effectComposer.addPass(shaderPass);

  // gui 控制颜色效果
  const shaderFolder = gui.addFolder("颜色选项");
  const createGuiColor = (property) => {
    return shaderFolder
      .add(colorPrams, property)
      .min(-1)
      .max(1)
      .step(0.01)
      .onChange((value) => (shaderPass.uniforms.uColor.value[property] = value));
  };
  createGuiColor("r");
  createGuiColor("g");
  createGuiColor("b");

  // --- 添加纹理并通过着色器与原始纹理混合，并增加波浪效果 ---
  const textureLoader = new THREE.TextureLoader();
  const normalTexture = textureLoader.load("../assets/images/particles/interfaceNormalMap.png");
  const techPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uNormalMap: { value: normalTexture },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      // 当前页面的纹理
      uniform sampler2D tDiffuse;
      // 自定义导入的纹理
      uniform sampler2D uNormalMap;
      // 自定义时间
      uniform float uTime;

      void main() {
        // 波浪效果
        vec2 newUv = vUv;
        newUv += sin(newUv.x * 10.0 + uTime * 2.0) * 0.01;

        vec4 color = texture2D(tDiffuse, newUv);
        vec4 normalColor = texture2D(uNormalMap, vUv); // 导入的纹理
        // 设置光线角度
        vec3 lightDirection = normalize(vec3(-5.0, 5.0, 0));
        // clamp 使值范围固定在 0.0 ~ 1.0 之间（小于 0.0 则为 0.0，大于 1.0 则为 1.0）
        float lightness = clamp(dot(normalColor.xyz, lightDirection), 0.0, 1.0);
        // 混合
        color.xyz += lightness;

        gl_FragColor = color;
      }
    `,
  });
  effectComposer.addPass(techPass);

  // --- render ---
  const clock = new THREE.Clock();
  const render = () => {
    // 更改自定义 uTime
    const time = clock.getElapsedTime();
    techPass.material.uniforms.uTime.value = time;

    controls.update();
    requestAnimationFrame(render);
    // 使用合成效果器的 render
    effectComposer.render();
  };

  render();

  return {
    beforeDestroy: () => gui.destroy(),
  };
};
