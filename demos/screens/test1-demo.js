import * as THREE from "three";
import { IDs, initThree } from "../core/model.js";

/**
 * demo，演示一些功能
 */
export default () => {
  // 默认生成一些必要内容
  const { scene, renderer } = initThree();

  // 创建网格材质对象
  const material = new THREE.MeshLambertMaterial({
    color: "#ffffff",
  });

  // 创建立方体
  const geometry = new THREE.BoxGeometry(100, 100, 100);

  // 创建网格模型对象
  const cube = new THREE.Mesh(geometry, material);
  // 添加到场景
  scene.add(cube);

  // ----- 自定义控制面板 -----
  const controlElement = document.createElement("div");
  controlElement.id = IDs.CONTROLS;
  controlElement.style =
    "padding: 16px; position: absolute; right: 24px; top: 24px; background-color: rgba(141, 141, 141, 0.6); border: 1px solid rgba(255, 255, 255, 0.6); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;";

  // 控制面板按钮
  const buttonTextArr = [
    "向左平移",
    "向右平移",
    "向上平移",
    "向下平移",
    "平缓地向左平移",
    "平缓地向右平移",
    "平缓地向上平移",
    "平缓地向下平移",
    "开始/暂停往返移动",
    "重置",
    "全屏/退出全屏",
  ];
  for (let i = 0; i < buttonTextArr.length; i++) {
    const buttonElement = document.createElement("button");
    buttonElement.innerHTML = buttonTextArr[i];
    buttonElement.onclick = () => onControlButtonClick(i);
    controlElement.appendChild(buttonElement);
  }
  container.appendChild(controlElement);

  // 控制面板事件
  const positionSize = 10;
  function onControlButtonClick(index) {
    switch (index) {
      case 0:
        // 旋转：rotation
        // 缩放：scale
        // 平移：position
        // 可以通过 cube.position.set(x, y, z) 来修改多个值
        cube.position.x -= positionSize;
        break;
      case 1:
        cube.position.x += positionSize;
        break;
      case 2:
        cube.position.y += positionSize;
        break;
      case 3:
        cube.position.y -= positionSize;
        break;
      case 4:
        gsapPosition({ x: -positionSize });
        break;
      case 5:
        gsapPosition({ x: positionSize });
        break;
      case 6:
        gsapPosition({ y: positionSize });
        break;
      case 7:
        gsapPosition({ y: -positionSize });
        break;
      case 8:
        gsapAnimate();
        break;
      case 9:
        reset();
        break;
      case 10:
        fullScreen();
        break;
    }
  }

  // 对模型对象进行平缓的移动，使用 gsap 第三方动画库
  function gsapPosition({ x = 0, y = 0, z = 0, duration = 1, ...others }) {
    gsap.to(cube.position, {
      x: cube.position.x + x,
      y: cube.position.y + y,
      z: cube.position.z + z,
      duration,
      onStart: () =>
        console.log(`平移开始, 传入参数: x: ${x}, y: ${y}, z: ${z}`),
      onComplete: () =>
        console.log(
          `平移完成! x: ${cube.position.x + x}, y: ${cube.position.y + y}, z: ${
            cube.position.z + z
          }`
        ),
      ...others,
    });
  }

  let gsapPositionObj, gsapRotateObj;
  // 对模型对象进行往复运动，使用 gsap 第三方库
  function gsapAnimate() {
    if (!gsapPositionObj) {
      gsapPositionObj = gsap.to(cube.position, {
        x: 100,
        y: 100,
        z: 50,
        duration: 2,
        repeat: -1, // 重复次数，-1 无限次
        yoyo: true, // 往返运动
      });
    }

    if (!gsapRotateObj) {
      gsapRotateObj = gsap.to(cube.rotation, {
        x: 2 * Math.PI,
        repeat: -1,
        duration: 2,
        ease: "power1.inOut",
      });
    }

    if (gsapPositionObj.isActive()) {
      gsapPositionObj.pause();
    } else {
      gsapPositionObj.resume();
    }

    if (gsapRotateObj.isActive()) {
      gsapRotateObj.pause();
    } else {
      gsapRotateObj.resume();
    }
  }

  // 重置 cube 位置和所有动画效果
  function reset() {
    if (!!gsapPositionObj) {
      gsapPositionObj.kill();
      gsapPositionObj = null;
    }
    if (!!gsapRotateObj) {
      gsapRotateObj.kill();
      gsapRotateObj = null;
    }
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
  }

  // 进入/退出全屏模式
  function fullScreen() {
    const container = document.getElementById(IDs.CONTAINER);
    // 全屏对象
    const fullscreenElement = document.fullscreenElement;

    // 没有全屏对象则全屏，否则退出全屏
    if (!fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return { scene, renderer };
};
