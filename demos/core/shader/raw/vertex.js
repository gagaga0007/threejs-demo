const vertexShader = /* glsl */ `
  // 导入着色器属性

  /**
    精度：
    highp -2^16 ~ 2^16
    mediump -2^10 ~ 2^10
    lowp -2^8 ~ 2^8
  */
  precision lowp float;
  
  attribute vec3 position; // 三维 - vec3
  attribute vec2 uv; // 二维 - vec2

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  // 获取 GLSL 自定义全局常量 - 时间
  uniform float uTime;

  varying vec2 vUv;

  // 自定义变量 - varying 用于 vertex shader 和 fragment shader 之间数据传递
  varying float vElevation;

  void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0); // position
    // modelPosition.x += 100.0; // 移动 x 轴
    // modelPosition.z += 70.0; // 移动 z 轴

    // modelPosition.z += modelPosition.x; // 倾斜效果

    // 波浪效果
    modelPosition.z += sin((modelPosition.x + uTime) * 10.0) * 0.03;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.03;

    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

export default vertexShader;
