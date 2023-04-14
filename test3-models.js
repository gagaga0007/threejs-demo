import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/**
 * 载入 3D 模型代码，目前路径下没有相关文件
 */
export default () => {
  // 载入 3D 模型
  const loader = new GLTFLoader();
  loader.load(
    "path/to/model.glb", // 路径下的模型（目前没有）
    (gltf) => {
      Scene.add(gltf.scene);
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
};
