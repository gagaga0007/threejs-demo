import * as THREE from "three";

/**
 * 资源跟踪器，用于跟踪和管理场景中的资源，以便在不需要时自动释放
 * 使用：
 * const resTracker = new ResourceTracker();
 * const track = resTracker.track.bind(resTracker);
 *
 * 在需要跟踪的位置使用，例如：
 * const geometry = track(new THREE.BoxGeometry(1, 1, 1));
 * const material = track(new THREE.MeshBasicMaterial({
 *    map: track(new THREE.TextureLoader().load('path/to/texture.jpg'))
 *  }));
 *
 * 释放资源：
 * resTracker.dispose();
 *
 * 例子：test28-sea.js
 */
export class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }

  track(resource) {
    if (!resource) return resource;

    // 如果资源是一个数组，则遍历数组并跟踪每个资源
    if (Array.isArray(resource)) {
      resource.forEach((r) => this.track(r));
      return resource;
    }

    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    // 如果是一个 Object3D，则递归跟踪其图元、材质和子对象
    if (resource instanceof THREE.Object3D) {
      this.track(resource.geometry);
      this.track(resource.material);
      this.track(resource.children);
    } else if (resource instanceof THREE.Material) {
      // 遍历材质的属性和 uniforms 寻找纹理
      // 先判断材质中有无 textures
      for (const value of Object.values(resource)) {
        if (value instanceof THREE.Texture) {
          this.track(value);
        }
      }
      // 再判断有无 uniforms 或 textures 数组
      if (resource.uniforms) {
        for (const value of Object.values(resource.uniforms)) {
          if (value) {
            const uniformValue = value.value;
            if (
              uniformValue instanceof THREE.Texture ||
              Array.isArray(uniformValue)
            ) {
              this.track(uniformValue);
            }
          }
        }
      }
    }
    return resource;
  }

  untrack(resource) {
    this.resources.delete(resource);
  }

  dispose() {
    for (const resource of this.resources) {
      if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource);
        }
      }
      if (resource.dispose) {
        resource.dispose();
      }
    }
    this.resources.clear();
  }
}
