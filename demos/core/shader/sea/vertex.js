const vertexShader = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>

varying vec2 vUv;

uniform float uTime;
// 海面起伏程度
uniform float uSCALE;

float calculateSurface(float x, float z) {
  float y = 0.0;

  // 多个三角函数叠加，增加随机性
  y += (sin(x * 1.0 / uSCALE + uTime * 1.0) + sin(x * 2.3 / uSCALE + uTime * 1.5) + sin(x * 3.3 / uSCALE + uTime * 0.4)) / 3.0;
  y += (sin(z * 0.2 / uSCALE + uTime * 1.8) + sin(z * 1.8 / uSCALE + uTime * 1.8) + sin(z * 2.8 / uSCALE + uTime * 0.8)) / 3.0;

  return y;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  pos.y += calculateSurface(pos.x, pos.z);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  #include <logdepthbuf_vertex>
}
`;

export default vertexShader;
