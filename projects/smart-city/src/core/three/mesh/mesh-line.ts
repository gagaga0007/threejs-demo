import * as THREE from 'three'
export const createMeshLine = (geometry: any) => {
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({ color: '#ffffff' })
  const line = new THREE.LineSegments(edges, material)
  geometry = edges

  const mesh = line

  return { mesh }
}
