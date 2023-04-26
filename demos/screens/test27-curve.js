import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 绘制曲线
 */
export default () => {
  const { scene, controls, camera, renderer } = initThree();

  const sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
  const shpereMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });
  const sphere = new THREE.Mesh(sphereGeometry, shpereMaterial);
  scene.add(sphere);

  // 球 - 根据点创建曲线（参数 - 点数组、是否闭合）
  const sphereCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-100, 0, 100),
      new THREE.Vector3(-50, 50, -50),
      new THREE.Vector3(50, -50, -50),
      new THREE.Vector3(100, 50, 100),
    ],
    true
  );
  // 在曲线里获取指定数量的点（此处示例为 101 个点，100 为分割数，所以得到的点是 101 个）
  const spherePoints = sphereCurve.getPoints(100);
  // 创建几何体
  const spherePointsGeometry = new THREE.BufferGeometry().setFromPoints(spherePoints);
  const sphereLineMaterial = new THREE.LineBasicMaterial({ color: "white" });
  // 创建线
  const sphereCurveLine = new THREE.Line(spherePointsGeometry, sphereLineMaterial);
  scene.add(sphereCurveLine);

  // 摄像机 - 根据点创建曲线
  const cameraCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-200, 50, 0),
      new THREE.Vector3(-140, 50, -140),
      new THREE.Vector3(0, 50, -200),
      new THREE.Vector3(140, 50, -140),
      new THREE.Vector3(200, 50, 0),
      new THREE.Vector3(140, 50, 140),
      new THREE.Vector3(0, 50, 200),
      new THREE.Vector3(-140, 50, 140),
    ],
    true
  );
  // 在曲线里获取指定数量的点（此处示例为 101 个点，100 为分割数，所以得到的点是 101 个）
  const cameraPoints = cameraCurve.getPoints(100);
  // 创建几何体
  const cameraPointsGeometry = new THREE.BufferGeometry().setFromPoints(cameraPoints);
  const cameraLineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  // 创建线
  const cameraCurveLine = new THREE.Line(cameraPointsGeometry, cameraLineMaterial);
  scene.add(cameraCurveLine);

  const clock = new THREE.Clock();
  const render = () => {
    const elapsedTime = clock.getElapsedTime();

    // 时间转化为 0 ~ 1
    const sphereTime = elapsedTime % 1;

    // 获取球曲线的点
    const spherePoint = sphereCurve.getPoint(sphereTime);
    // 修改球位置
    sphere.position.copy(spherePoint);

    const cameraTime = (elapsedTime / 10) % 1;

    // 获取摄像机曲线的点
    const cameraPoint = cameraCurve.getPoint(cameraTime);
    // 修改摄像机位置
    camera.position.copy(cameraPoint);
    camera.lookAt(sphere.position);

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
  };

  render();
};
