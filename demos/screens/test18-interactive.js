import * as THREE from "three";
import { initThree } from "../core/model.js";

export default () => {
  const { scene, camera, renderer } = initThree({
    cameraPosition: { x: 10, y: 10, z: 15 },
  });

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ wireframe: true });
  const redMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });

  // 创建 1000 个立方体
  const cubeArray = [];
  for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
      for (let k = -5; k < 5; k++) {
        const cube = new THREE.Mesh(cubeGeometry, material);
        cube.position.set(i, j, k);
        cubeArray.push(cube);
        scene.add(cube);
      }
    }
  }

  // 创建投射光
  const raycaster = new THREE.Raycaster();
  // 鼠标位置对象
  const mouse = new THREE.Vector2();

  // 监听鼠标事件
  window.addEventListener("click", onMouseClick);
  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    // 鼠标位置有多少个物体
    const result = raycaster.intersectObjects(cubeArray);
    // if (!!result[0]) result[0].object.material = redMaterial;
    // 覆盖材质为红色
    result.forEach((v) => {
      v.object.material = redMaterial;
    });
  }

  return {
    beforeDestroy: () => {
      window.removeEventListener("click", onMouseClick);
    },
    scene,
    renderer,
  };
};
