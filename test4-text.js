import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

/**
 * 创建文字相关代码，目前路径下没有相关字体文件
 *
 * 注：最简单的方法是使用 DOM + CSS，下面的方法是使用 three 实现的
 */
export default () => {
  // Three 中的创建文字
  const loader = new FontLoader();

  // 需要引入字体文件（目前没有）
  loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
    const geometry = new TextGeometry("Hello three.js!", {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 5,
    });
  });
};
