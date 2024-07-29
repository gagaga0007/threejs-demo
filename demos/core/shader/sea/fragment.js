const fragmentShader = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec2 vUv;

uniform sampler2D uMap;
uniform float uTime;
uniform vec3 uColor;

void main() {
  #include <logdepthbuf_fragment>

  vec2 uv = vUv * 10.0 + vec2(uTime * -0.05);

  // uv
  uv.y += 0.01 * (sin(uv.x * 3.5 + uTime * 0.35) + sin(uv.x * 4.8 + uTime * 1.05) + sin(uv.x * 7.3 + uTime * 0.45)) / 3.0;
  uv.x += 0.12 * (sin(uv.y * 4.0 + uTime * 0.5) + sin(uv.y * 6.8 + uTime * 0.75) + sin(uv.y * 11.3 + uTime * 0.2)) / 3.0;
  uv.y += 0.12 * (sin(uv.x * 4.2 + uTime * 0.64) + sin(uv.x * 6.3 + uTime * 1.65) + sin(uv.x * 8.2 + uTime * 0.45)) / 3.0;

  // 纹理采样
  vec4 text1 = texture2D(uMap, uv * 1.0);
  vec4 text2 = texture2D(uMap, uv * 1.0 + vec2(0.2));

  vec3 blue = uColor;

  gl_FragColor = vec4(blue + vec3(text1.a * 0.9 - text2.a * 0.02), 1.0);
}
`;

export default fragmentShader;
