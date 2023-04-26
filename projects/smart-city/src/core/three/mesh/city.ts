import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { scene } from '../model'
import { modifyCityMaterial } from '@/core/three/modify/modifyCityMaterial'

export const createCity = () => {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('../../../../public/model/city.glb', (gltf) => {
    gltf.scene.traverse((item) => {
      if (item.type === 'Mesh') {
        // @ts-ignore
        item.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x0c0e33)
        })
        modifyCityMaterial(item)
      }
    })

    scene.add(gltf.scene)
  })
}
