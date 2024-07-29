import * as THREE from "three";
import { initThree } from "../core/model.js";

/**
 * 点、点材质 - 星系效果
 */
export default () => {
  const { scene, renderer } = initThree();

  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  const particlesTexture = textureLoader.load(
    "./assets/images/particles/1.png"
  );

  const params = {
    count: 30000, // 生成数量
    size: 5, // 大小
    radius: 300, // 半径
    branch: 6, // 分支数量
    color: "#ff6030", // 颜色
    rotateScale: 0.01, // 弯曲程度
    endColor: "#ffffff", // 边缘颜色
  };

  // 生成顶点
  const geometry = new THREE.BufferGeometry();
  // 生成随机位置
  const positions = new Float32Array(params.count * 3);
  // 顶点颜色
  const colors = new Float32Array(params.count * 3);
  // 原点颜色
  const centerColor = new THREE.Color(params.color);
  // 边缘颜色
  const endColor = new THREE.Color(params.endColor);

  // 循环生成点
  for (let i = 0; i < params.count; i++) {
    // 设置越靠近中间越密集
    const distanceCenter = Math.pow(Math.random(), 3);
    // 当前点应当在的分支的角度
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius * distanceCenter;
    // const distance = Math.random() * params.radius

    // 设置密集程度（越靠近原点和轴线越密集）
    const randomX =
      (Math.pow(Math.random() * 6 - 3, 3) * (params.radius - distance)) / 200;
    const randomY =
      (Math.pow(Math.random() * 6 - 3, 3) * (params.radius - distance)) / 200;
    const randomZ =
      (Math.pow(Math.random() * 6 - 3, 3) * (params.radius - distance)) / 200;

    // 设置坐标点
    const current = i * 3;
    positions[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    positions[current + 1] = 0 + randomY;
    positions[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;

    // 混合颜色
    const mixColor = centerColor.clone();
    // 从原点开始到边缘，颜色从 centerColor 依次渐变到 endColor
    mixColor.lerp(endColor, distance / params.radius);
    // 设置颜色
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 设置点材质
  const material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true, // 近大远小效果
    depthWrite: false,
    blending: THREE.AdditiveBlending, //叠加效果
    map: particlesTexture,
    vertexColors: true,
  });

  // 生成点
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return { scene, renderer };
};
