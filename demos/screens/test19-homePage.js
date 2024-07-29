import * as THREE from "three";
import { IDs, initThree } from "../core/model.js";

/**
 * 使用 threejs 制作首页效果
 * 实现方式：三个 page 放在同一个场景中，指定一个 canvas
 * 其它实现方方式：创建多个 canvas 并设置各自的样式，创建多个场景并分别指定不同的 canvas，每个场景单独设置各自的内容（未测试可行性）
 *
 * HTML 处使用了 vscode 插件 Comment tagged templates 用于语法高亮显示
 */
export default () => {
  const html = /* html */ `
    <link rel="stylesheet" href="./assets/css/test19.css" />
    <div class="page page1">
      <h1>THREE.Raycaster</h1>
      <h3>使用投射光实现交互效果（点击）</h3>
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
    cameraPosition: { x: 0, y: 0, z: 20 },
    cameraLookAt: { x: 0, y: 0, z: 0 },
    rendererOptions: { alpha: true },
  });

  const spacing = 30; // 每个 group 之间 y 轴的距离
  const mouse = new THREE.Vector2(); // 鼠标位置对象
  const cubeGroup = new THREE.Group(); // page1 group
  const triangleGroup = new THREE.Group(); // page2 group
  const ballGroup = new THREE.Group(); // page3 group
  const pageGroups = [cubeGroup, triangleGroup, ballGroup];

  const onPage1MouseClick = (
    event,
    { raycaster, camera, redMaterial, cubeArray }
  ) => {
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
    for (let i = -2; i < 3; i++) {
      for (let j = -2; j < 3; j++) {
        for (let k = -2; k < 3; k++) {
          const cube = new THREE.Mesh(cubeGeometry, material);
          cube.position.set(i, j, k);
          cubeArray.push(cube);
          cubeGroup.add(cube);
        }
      }
    }

    // gsap效果
    gsap.to(cubeGroup.rotation, {
      x: "+=" + Math.PI * 2,
      duration: 2,
      repeat: -1,
      ease: "none",
    });

    // 创建投射光
    const raycaster = new THREE.Raycaster();
    // 监听鼠标事件
    window.addEventListener("click", (e) =>
      onPage1MouseClick(e, { raycaster, mouse, camera, redMaterial, cubeArray })
    );

    scene.add(cubeGroup);
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
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positionArray, 3)
      );

      // 设置随机颜色
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      // 创建材质
      const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);

      triangleGroup.add(mesh);
    }

    // gsap效果
    gsap.to(triangleGroup.rotation, {
      y: "+=" + Math.PI * 2,
      duration: 2,
      repeat: -1,
      ease: "none",
    });

    triangleGroup.position.set(0, -spacing, 0);
    scene.add(triangleGroup);
  };

  // 仿照 test13 生成 page3
  let lightBall; // 具象化的点光源
  const createPage3 = () => {
    const material = new THREE.MeshStandardMaterial();

    // 创建点光源
    const pointLight = new THREE.PointLight("#ff0000", 0.5);
    pointLight.position.set(2, 2, 2);
    ballGroup.add(pointLight);

    // 将点光源具象化（设置一个球体放在光源处）
    const lightBallGeometry = new THREE.SphereGeometry(0.1, 20, 20);
    const basicMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });
    lightBall = new THREE.Mesh(lightBallGeometry, basicMaterial);
    lightBall.position.set(2, 2, 2);
    lightBall.add(pointLight); // 把光源作为该球体的一部分
    ballGroup.add(lightBall);

    // 创建球体
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphere = new THREE.Mesh(sphereGeometry, material);
    ballGroup.add(sphere);

    // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    ballGroup.add(plane);

    // 渲染器开启阴影计算
    renderer.shadowMap.enabled = true;
    // 光照设置投射阴影
    pointLight.castShadow = true;
    // 物体设置投射阴影（上方球体）
    sphere.castShadow = true;
    // 物体设置接收阴影（下方平面）
    plane.receiveShadow = true;

    // 阴影贴图模糊度
    pointLight.shadow.radius = 20;
    // 阴影贴图分辨率
    pointLight.shadow.mapSize.set(512, 512);
    // 光源衰减距离
    pointLight.distance = 0;
    // 光源根据衰减距离的衰减量，需要设置 distance
    pointLight.decay = 1;

    ballGroup.position.set(0, -(2 * spacing), 0);
    scene.add(ballGroup);
  };

  // 创建page
  createPage1();
  createPage2();
  createPage3();

  // render
  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();
    // const deltaTime = clock.getDelta(); // 时间差

    // page1 旋转效果，如果设置这些，需要删除 gsap 设置部分，不然会冲突
    // cubeGroup.rotation.x = time * 0.5;
    // cubeGroup.rotation.y = time * 0.5;
    // page2 旋转效果
    // triangleGroup.rotation.x = time * 0.5;
    // triangleGroup.rotation.z = time * 0.5;
    // page3 旋转效果
    // ballGroup.rotation.x = Math.sin(time) * 0.1;
    // ballGroup.rotation.z = Math.sin(time * 2) * 0.1;
    // page3 光源效果
    lightBall.position.x = Math.sin(time) * 3;
    lightBall.position.y = 2 + Math.sin(time * 3);
    lightBall.position.z = Math.cos(time) * 3;

    // 根据滚动的 scrollY，设置相机移动的位置
    camera.position.y = -(window.scrollY / window.innerHeight) * 30;
    // 相机随鼠标移动而移动，设置最多 10 像素
    camera.position.x = mouse.x * 10;
    // camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime;

    // 渲染场景
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();

  // 滚动事件
  let currentPageIndex = 0;
  const onWindowScroll = (event) => {
    // 四舍五入算出滚动到了第几个页面
    const newPageIndex = Math.round(window.scrollY / window.innerHeight);
    if (newPageIndex !== currentPageIndex) {
      currentPageIndex = newPageIndex;
      // 滚动到当前 page 触发效果
      // 对应 goup 旋转效果
      gsap.to(pageGroups[newPageIndex].rotation, {
        z: "+=" + Math.PI * 2,
        duration: 1,
      });
      // 对应标题飞入旋转效果
      gsap.fromTo(
        `.page${newPageIndex + 1} h1`,
        { x: -500 },
        { x: 0, rotate: "+= 360", duration: 1 }
      );
    }
  };
  window.addEventListener("scroll", onWindowScroll);

  // 鼠标移动事件，设置鼠标位置对象的位置
  const onMouseMove = (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("mousemove", onMouseMove);

  return {
    beforeDestroy: () => {
      window.removeEventListener("click", onPage1MouseClick);
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("mousemove", onMouseMove);
    },
    scene,
    renderer,
  };
};
