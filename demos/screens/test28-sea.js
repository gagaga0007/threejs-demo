import * as THREE from "three";
import { IDs } from "../core/model.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader from "../core/shader/sea/vertex.js";
import fragmentShader from "../core/shader/sea/fragment.js";

export default () => {
  // 渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const container = document.getElementById(IDs.CONTAINER);
  const canvasElement = renderer.domElement;
  container.appendChild(canvasElement);

  // 相机
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 10, 20);

  // 窗口自适应
  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resize, false);

  // 场景
  const scene = new THREE.Scene();

  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 时钟
  const clock = new THREE.Clock();
  let elapsedTime = clock.getElapsedTime();

  // 平行光
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(0, 10, 20);
  scene.add(light);

  // 平行光2
  const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
  light2.position.set(-5, 5, -5);
  scene.add(light2);

  // 环境光
  const light3 = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(light3);

  // 模拟小船
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial()
  );
  scene.add(box);

  // 法线辅助器
  const helperGeometry = new THREE.BufferGeometry();
  helperGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 5, 0]), 3)
  );
  const lineHelper = new THREE.LineSegments(
    helperGeometry,
    new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false })
  );
  scene.add(lineHelper);

  // 海平面
  const SCALE = 5;

  const texture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/water.jpg"
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const uniforms = {
    uMap: { value: texture },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#0051da") },
    uSCALE: { value: SCALE },
    depthTest: true,
    depthWrite: true,
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    wireframe: true,
  });

  const geometry = new THREE.PlaneGeometry(100, 100, 500, 500);
  geometry.rotateX(-Math.PI / 2);

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // dx dz 求导公式，用于计算斜率
  function dx(x, t) {
    const cos = Math.cos;
    return (
      (1 / 3) *
      (cos(x / SCALE + t) / SCALE +
        (cos((2.3 * x) / SCALE + 1.5 * t) * 2.3) / SCALE +
        (cos((3.3 * x) / SCALE + 0.4 * t) * 3.3) / SCALE)
    );
  }

  function dz(z, t) {
    const cos = Math.cos;
    return (
      (1 / 3) *
      ((cos((0.2 * z) / SCALE + 1.8 * t) * 0.2) / SCALE +
        (cos((1.8 * z) / SCALE + 1.8 * t) * 1.8) / SCALE +
        (cos((2.8 * z) / SCALE + 0.8 * t) * 2.8) / SCALE)
    );
  }

  // 计算旋转角度
  function getAngleBetweenVectors(v1, v2, dotThreshold = 0.00005) {
    let angle = 0;
    const dot = v1.dot(v2);

    if (dot > 1 - dotThreshold) {
      angle = 0;
    } else if (dot < dotThreshold - 1) {
      angle = Math.PI;
    } else {
      angle = Math.acos(dot);
    }
    return angle;
  }

  // 渲染
  const render = () => {
    requestAnimationFrame(render);

    elapsedTime = clock.getElapsedTime();

    // 更新时间
    material.uniforms.uTime.value = elapsedTime;

    // 更新小船高度
    const position = box.position;

    const { x, z } = position;
    const { sin, cos, atan } = Math;
    position.y =
      (sin((x * 1.0) / SCALE + elapsedTime * 1.0) +
        sin((x * 2.3) / SCALE + elapsedTime * 1.5) +
        sin((x * 3.3) / SCALE + elapsedTime * 0.4)) /
      3.0;
    position.y +=
      (sin((z * 0.2) / SCALE + elapsedTime * 1.8) +
        sin((z * 1.8) / SCALE + elapsedTime * 1.8) +
        sin((z * 2.8) / SCALE + elapsedTime * 0.8)) /
      3.0;

    // 更新小船斜率
    const kx = dx(x, elapsedTime);
    const kz = dz(z, elapsedTime);
    // 根据斜率得到切面法线
    const n = new THREE.Vector3(-kx, 1, -kz).normalize();
    // 计算旋转轴
    const axes = new THREE.Vector3()
      .crossVectors(n, new THREE.Vector3(kx, 1, kz))
      .normalize();
    // 计算旋转角度
    const angle = getAngleBetweenVectors(new THREE.Vector3(0, 1, 0), n);
    // 进行旋转
    box.rotation.x = 0;
    box.rotation.y = 0;
    box.rotation.z = 0;
    box.rotateOnAxis(axes, -angle);

    // 计算小船加速度
    const speed = new THREE.Vector3(0, 0, 0);
    // 小船加速度方向
    const dir = new THREE.Vector3()
      .crossVectors(n, speed)
      .normalize()
      .divideScalar(100);
    // 小船加速度叠加海平面倾斜带来的速度 = 最终速度
    const newSpeed = speed.add(dir);

    // 小船最终位置
    const endPosition = box.position.clone().addScaledVector(newSpeed, 1);
    let y =
      (sin((x * 1.0) / SCALE + elapsedTime * 1.0) +
        sin((x * 2.3) / SCALE + elapsedTime * 1.5) +
        sin((x * 3.3) / SCALE + elapsedTime * 0.4)) /
      3.0;
    y +=
      (sin((z * 0.2) / SCALE + elapsedTime * 1.8) +
        sin((z * 1.8) / SCALE + elapsedTime * 1.8) +
        sin((z * 2.8) / SCALE + elapsedTime * 0.8)) /
      3.0;

    const truePosition = new THREE.Vector3(endPosition.x, y, endPosition.z);
    box.position.copy(truePosition);

    controls.update();
    renderer.render(scene, camera);
  };
  render();

  return {
    scene,
    renderer,
  };
};
