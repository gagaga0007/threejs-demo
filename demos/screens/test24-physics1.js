import * as THREE from "three";
import * as CANNON from "cannon-es";
import { initThree } from "../core/model.js";

/**
 * 物理效果
 * 需要设置渲染物体和物理物体，并在渲染时保持二者位置一致
 */
export default () => {
  const { scene, renderer, controls, camera } = initThree({
    disableRender: true,
    cameraPosition: { x: 80, y: 0, z: 80 },
  });

  // 创建平行光
  const dirLight = new THREE.DirectionalLight("#ffffff", 0.5);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.position.set(0, 100, 0);

  renderer.shadowMap.enabled = true;

  // 创建球体
  const sphereGeometry = new THREE.SphereGeometry(5, 20, 20);
  const sphereMaterial = new THREE.MeshStandardMaterial();
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);
  sphere.castShadow = true;

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, -30, 0);
  plane.receiveShadow = true;

  // 创建物理世界
  const world = new CANNON.World();
  world.gravity.set(0, -9.8, 0);

  // 创建球体物理材质，自定义名称为 sphere
  const spherePhysicMaterial = new CANNON.Material("sphere");
  // 创建物理球体
  const sphereShape = new CANNON.Sphere(5);
  const sphereBody = new CANNON.Body({
    shape: sphereShape, // 形状
    position: new CANNON.Vec3(0, 0, 0), // 位置
    mass: 1, // 质量
    material: spherePhysicMaterial, // 材质
  });
  // 将物理球体添加到物理世界
  world.addBody(sphereBody);

  // 创建平面物理材质，自定义名称为 plane
  const planePhysicMaterial = new CANNON.Material("plane");
  // 创建物理平面
  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body();
  // 可以通过如下方式分别设置 body 的属性
  planeBody.addShape(planeShape);
  planeBody.position.set(0, -30, 0);
  planeBody.material = planePhysicMaterial;
  // 使物体保持不动（将 mass 设置为 0 会有同样效果）
  planeBody.type = CANNON.Body.STATIC;
  // 旋转地面的位置
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  // 将物理平面添加到物理世界
  world.addBody(planeBody);

  // 设置两种物理材质的关联材质
  const defaultContactMaterial = new CANNON.ContactMaterial(
    spherePhysicMaterial,
    planePhysicMaterial,
    {
      friction: 0.1, // 摩擦系数
      restitution: 0.7, // 弹性
    }
  );
  // 将材料关联材质设置添加到物理世界
  world.addContactMaterial(defaultContactMaterial);

  // 增加监听碰撞事件
  const onSphereCollide = (e) => {
    // 获取碰撞强度 (number)
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    console.log(impactStrength);
    // 某强度以上时播放碰撞声音（需要焦点在页面中，否则浏览器默认静音）
    if (impactStrength > 2) {
      // 创建碰撞声音
      const hitSound = new Audio("./assets/audio/metalHit.mp3");
      const volume = impactStrength / 50;
      hitSound.volume = volume > 0.4 ? 0.4 : volume;
      hitSound.play(hitSound);
    }
  };
  sphereBody.addEventListener("collide", onSphereCollide);

  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();
    // 更新物理世界，60 帧为例（step(帧，时间差)）
    world.step(1 / 60, time);
    // 将物理球体的位置复制给渲染球体
    sphere.position.copy(sphereBody.position);

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();

  return {
    beforeDestroy: () => {
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
    },
    scene,
    renderer,
  };
};
