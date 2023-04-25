import * as THREE from "three";
import * as CANNON from "cannon-es";
import { initThree } from "../core/model.js";

const cubePositionY = 40; // 立方体 y 轴
const planePostionY = -15; // 平面 y 轴

/**
 * 物理效果
 */
export default () => {
  const { scene, renderer, controls, camera } = initThree({
    disableRender: true,
    cameraPosition: { x: 50, y: 15, z: 50 },
  });

  // 创建平行光
  const dirLight = new THREE.DirectionalLight("#ffffff", 0.5);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.position.set(0, 100, 0);

  renderer.shadowMap.enabled = true;

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(500, 500);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, planePostionY, 0);
  plane.receiveShadow = true;
  scene.add(plane);

  // 创建物理世界
  const world = new CANNON.World();
  world.gravity.set(0, -9.8, 0);

  // 创建平面物理材质，自定义名称为 plane
  const planePhysicMaterial = new CANNON.Material("plane");
  // 创建物理平面
  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body();
  // 可以通过如下方式分别设置 body 的属性
  planeBody.addShape(planeShape);
  planeBody.position.set(0, planePostionY, 0);
  planeBody.material = planePhysicMaterial;
  // 使物体保持不动（将 mass 设置为 0 会有同样效果）
  planeBody.type = CANNON.Body.STATIC;
  // 旋转地面的位置
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  // 将物理平面添加到物理世界
  world.addBody(planeBody);

  // 创建立方体物理材质，自定义名称为 cube
  const cubePhysicMaterial = new CANNON.Material("cube");

  // 创建多个立方体
  let cubeArr = [];
  const createCube = () => {
    // 创建渲染立方体
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = cubePositionY;
    cube.castShadow = true;
    scene.add(cube);

    // 创建物理立方体，需要设置为渲染的立方体的一半
    const cubeShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const cubeBody = new CANNON.Body({
      shape: cubeShape, // 形状
      position: new CANNON.Vec3(0, cubePositionY, 0), // 位置
      mass: 1, // 质量
      material: cubePhysicMaterial, // 材质
    });
    // 添加力（演示为随机在 x 和 z 轴添加不同大小的力） applyLocalForce(力大小和方向, 力所在的位置)
    cubeBody.applyLocalForce(
      new CANNON.Vec3(Math.random() * (300 - -300 + 1) + -300, 0, Math.random() * (300 - -300 + 1) + -300),
      new CANNON.Vec3(0, 0, 0)
    );

    // 将物理立方体添加到物理世界
    world.addBody(cubeBody);

    // mesh - 渲染立方体; body - 物理立方体
    cubeArr.push({ mesh: cube, body: cubeBody });
  };

  // 设置两种物理材质的关联材质
  const defaultContactMaterial = new CANNON.ContactMaterial(cubePhysicMaterial, planePhysicMaterial, {
    friction: 0.5, // 摩擦系数
    restitution: 0.7, // 弹性
  });
  // 将材料关联材质设置添加到物理世界
  world.addContactMaterial(defaultContactMaterial);
  // 设置世界默认材料（若材料没有设置，则默认是该材质）
  world.defaultContactMaterial = defaultContactMaterial;

  // 定时创建小球
  let timer = setInterval(() => {
    if (cubeArr.length <= 100) {
      createCube();
    }
  }, 100);

  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();
    // 更新物理世界，60 帧为例（step(帧，时间差)）
    world.step(1 / 60, time);
    // 将物理球体的属性复制给渲染球体
    cubeArr.forEach((v) => {
      v.mesh.position.copy(v.body.position); // 位置
      v.mesh.quaternion.copy(v.body.quaternion); // 旋转
    });

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();

  return {
    beforeDestroy: () => {
      clearInterval(timer);
      timer = null;

      // 销毁渲染实例
      cubeArr.forEach((v) => {
        v.mesh.geometry.dispose();
        v.mesh.material.dispose();
      });
      planeGeometry.dispose();
      planeMaterial.dispose();
    },
  };
};
