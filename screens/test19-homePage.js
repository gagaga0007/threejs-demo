import * as THREE from "three";
import { IDs, initThree } from "../core/model.js";

export default () => {
  const html = `
    <link rel="stylesheet" href="../assets/css/test19.css" />
    <div class="page page1">
      <h1>THREE.Raycaster 投射光</h1>
      <h3>实现交互效果</h3>
    </div>
    <div class="page page2">
      <h1>THREE.BufferGeometry</h1>
      <h3>打造三角形</h3>
    </div>
    <div class="page page3">
      <h1>THREE.PointLight</h1>
      <h3>围绕小球的点光源</h3>
    </div>
  `;

  const container = document.getElementById(IDs.CONTAINER);
  container.innerHTML = html;

  const { scene, camera, renderer } = initThree({
    showAxesHelper: false,
    disableControls: true,
    disableRender: true,
    cameraPosition: { x: 2, y: 2, z: 20 },
    cameraLookAt: { x: 2, y: 2, z: 0 },
    rendererOptions: { alpha: true },
  });

  const spacing = 30; // 每个 group 之间 y 轴的距离
  const cubeGroup = new THREE.Group(); // page1 group
  const triangleGroup = new THREE.Group(); // page2 group

  const onPage1MouseClick = (event, { raycaster, mouse, camera, redMaterial, cubeArray }) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    // 鼠标位置有多少个物体
    const result = raycaster.intersectObjects(cubeArray);
    // 覆盖材质为红色
    result.forEach((v) => {
      v.object.material = redMaterial;
    });
  };

  // 仿照 test18 生成 page1
  const createPage1 = () => {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const redMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });

    // 创建立方体
    const cubeArray = [];
    // 立方体组
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
          const cube = new THREE.Mesh(cubeGeometry, material);
          cube.position.set(i, j, k);
          cubeArray.push(cube);
          cubeGroup.add(cube);
        }
      }
    }

    scene.add(cubeGroup);

    // 创建投射光
    const raycaster = new THREE.Raycaster();
    // 鼠标位置对象
    const mouse = new THREE.Vector2();

    // 监听鼠标事件
    window.addEventListener("click", (e) => onPage1MouseClick(e, { raycaster, mouse, camera, redMaterial, cubeArray }));
  };

  // 仿照 test5 生成 page2
  const createPage2 = () => {
    // 生成 10 个三角形
    for (let i = 0; i <= 10; i++) {
      // 创建缓冲区几何体
      const geometry = new THREE.BufferGeometry();
      // 缓冲区设置 9 个值（三个坐标确定一个顶点，三个顶点组成一个三角形）
      const positionArray = new Float32Array(9);
      for (let j = 0; j < 9; j++) {
        if (j % 3 === 1) {
          // 设置 y 轴，使得到的效果可以在下一页显示
          positionArray[j] = Math.random() * (10 - 0 + 1) + 0 - 5;
        } else {
          positionArray[j] = Math.random() * (10 - 0 + 1) + 0 - 5;
        }
      }
      // 设置每三个一组
      geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));

      // 设置随机颜色
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      // 创建材质
      const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);

      triangleGroup.add(mesh);
    }

    triangleGroup.position.set(0, -spacing, 0);
    scene.add(triangleGroup);
  };

  const createPage3 = () => {};

  // 创建page
  createPage1();
  createPage2();

  // render
  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();

    // page1 旋转效果
    cubeGroup.rotation.x = time * 0.5;
    cubeGroup.rotation.y = time * 0.5;
    // page2 旋转效果
    triangleGroup.rotation.x = time * 0.5;
    triangleGroup.rotation.z = time * 0.5;

    // 根据滚动的 scrollY，设置相机移动的位置
    camera.position.y = -(window.scrollY / window.innerHeight) * spacing;

    // 渲染场景
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();

  // 滚动事件
  let currentPageIndex = 0;
  const onWindowScroll = (event) => {
    // 四舍五入算出是第几个页面
    const newPageIndex = Math.round(window.scrollY / window.innerHeight);
    if (newPageIndex !== currentPageIndex) {
      currentPageIndex = newPageIndex;
    }
  };
  window.addEventListener("scroll", onWindowScroll);

  return {
    beforeDestroy: () => {
      window.removeEventListener("click", onPage1MouseClick);
      window.removeEventListener("scroll", onWindowScroll);
    },
  };
};
