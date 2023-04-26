const fragmentShader = /* glsl */ `
  precision lowp float;
  varying vec2 vUv;

  // vertex 中定义的变量
  varying float vElevation;

  // 导入自定义变量 - 纹理
  uniform sampler2D uTexture;

  void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // 随波浪设置颜色明暗
    float height = vElevation + 0.8;
    // gl_FragColor = vec4(1.0 * height, 0.0, 0.0, 1.0);

    // 根据 uv 取出纹理对应颜色
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= height;
    gl_FragColor = textureColor;
  }
`;

export default fragmentShader;
