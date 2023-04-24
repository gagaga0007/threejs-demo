const vertexShader = /* glsl */ `
  // 导入着色器属性

  /**
    精度：
    highp -2^16 ~ 2^16
    mediump -2^10 ~ 2^10
    lowp -2^8 ~ 2^8
  */
  precision mediump float;
  
  attribute vec3 position; // 三维 - vec3
  attribute vec2 uv; // 二维 - vec2

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0); // position

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

export default vertexShader;
