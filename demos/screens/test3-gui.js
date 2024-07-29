import * as dat from "dat.gui";
import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 使用 dat.gui 第三方库实现控制栏
 */
export default () => {
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

  // 创建 gui
  const gui = new dat.GUI();

  // 配置项
  const params = {
    color: "#ffffff",
    changePositionRight: () =>
      gsap.to(cube.position, { x: cube.position.x + 50 }),
    changePositionLeft: () =>
      gsap.to(cube.position, { x: cube.position.x - 50 }),
  };

  // 配置点击事件
  gui.add(params, "changePositionRight").name("点击右移");
  gui.add(params, "changePositionLeft").name("点击左移");

  // 增加分组
  const optionFolder = gui.addFolder("配置选项");

  // 分组下增加选项
  // 配置坐标
  optionFolder
    .add(cube.position, "x")
    .min(-200)
    .max(200)
    .step(0.01)
    .name("x 轴坐标");
  // .onChange((value) => console.log("onChange: " + value)) // 修改实时触发
  // .onFinishChange((value) => console.log("onFinishChange: " + value)); // 鼠标按键抬起才触发

  // 配置颜色
  optionFolder
    .addColor(params, "color")
    .name("修改颜色")
    .onChange((value) => {
      cube.material.color.set(value);
    });

  // 配置显示
  optionFolder.add(cube, "visible").name("显示");
  optionFolder.add(cube.material, "wireframe").name("显示线框");

  // index.js 切换时触发
  return {
    // 销毁 gui 弹层
    beforeDestroy: () => gui.destroy(),
    scene,
    renderer,
  };
};
