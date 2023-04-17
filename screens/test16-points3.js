import * as THREE from "three";
import { initThree } from "../model.js";

/**
 * 点、点材质 - 雪花效果
 */
export default () => {
  const { scene, renderer, camera } = initThree({
    disableRender: true,
    disableControls: true,
    showAxesHelper: false,
    cameraPosition: { x: 0, y: 0, z: 200 },
  });

  const createPoints = (url, materialSize = 7.0) => {
    // 生成星空效果
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 8000; // 生成数量
    const size = 3; // 定义三个位置为一个顶点
    const minPosition = -250; // 随机最小坐标
    const maxPosition = 250; // 随机最大坐标

    // 设置缓冲区数组
    const positions = new Float32Array(count * size);
    // 设置顶点
    for (let i = 0; i < count * size; i++) {
      // 设置随机坐标
      positions[i] = Math.random() * (maxPosition - minPosition + 1) + minPosition;
    }
    // 设置属性 - 位置
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, size));

    // 创建点材质
    const pointsMaterial = new THREE.PointsMaterial({ size: materialSize });
    // 创建点
    const points = new THREE.Points(particlesGeometry, pointsMaterial);
    scene.add(points);

    // 导入并纹理
    const textureLoader = new THREE.TextureLoader();
    const pointTexture = textureLoader.load(url);

    // —————— 设置材质属性 ——————————
    pointsMaterial.sizeAttenuation = true;
    pointsMaterial.transparent = true;
    pointsMaterial.map = pointTexture;
    pointsMaterial.alphaMap = pointTexture;
    pointsMaterial.depthWrite = false;
    pointsMaterial.blending = THREE.AdditiveBlending;

    return points;
  };

  // 生成三个不同效果的雪花
  const points1 = createPoints("./assets/particles/snow.png");
  const points2 = createPoints("./assets/particles/14.png");
  const points3 = createPoints("./assets/particles/3.png");

  // 设置相机远端面，此处是为了不显示后方向上旋转的雪花
  camera.far = 120.0;
  camera.updateProjectionMatrix(); // 相机更改属性后需调用此方法进行更新

  const clock = new THREE.Clock();

  function render() {
    const time = clock.getElapsedTime();
    points1.rotation.x = time * 0.05;
    points2.rotation.x = time * 0.1;
    points3.rotation.x = time * 0.12;
    points1.rotation.y = time * 0.02;

    // 默认操作
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
};
