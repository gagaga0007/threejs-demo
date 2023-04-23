const fragmentShader = /* glsl */ `
  precision lowp float;

  uniform float uTime;

  varying vec2 vUv;

  // 随机函数（thebookofshaders.com 中找的）
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.2323))) * 43758.5453123);
  }

  // 旋转效果
  vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
  }

  void main() {
    // // 1、通过顶点对应的 uv，决定每一个像素在 uv 图像的位置，通过位置决定这个像素的颜色
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // // 2、利用 uv 实现渐变效果，从左到右
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 3、从下到上
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 4、从上到下
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 5、从下到上，短范围渐变
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 6、从下到上，百叶窗效果，使用 mod 函数实现
    // float strength = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 7、斑马线效果，使用 step 函数，如果 x < 0.5 返回 0.0，否则返回 1.0
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 8、横纵斑马线效果相交（+= 改为 *=、-= 会有不同效果）
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 9、方块阵效果
    // float strength = step(0.2, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.2, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 10、"7"型彩色条纹效果
    // float barx = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float bary = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barx + bary;
    // // gl_FragColor = vec4(strength, strength, strength, 1.0);
    // gl_FragColor = vec4(vUv, 1.0, strength);

    // // 11、"7"型条纹随时间变化效果
    // float barx = step(0.4, mod((vUv.x + uTime * 0.1) * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float bary = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barx + bary;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 12、"7"型条纹偏移为"T"型条纹
    // float barx = step(0.4, mod((vUv.x * 10.0 - 0.2), 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float bary = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barx + bary;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 13、利用 abs 绝对值函数，中间向左右两侧渐变
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 14、利用 abs、min 函数，十字渐变
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 15、利用 abs、max 函数，中心向外渐变（1.0 - max(...) 使中心亮两边暗）
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 16、亮矩形嵌套暗矩形（1.0 - step(...) 反过来）
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 17、使用向下取整 floor 函数实现条纹渐变（向上取整 ceil(...)）
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 18、使用向下取整 floor 函数实现斜向格子渐变
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 19、使用随机函数实现电视雪花无信号效果
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 20、使用随机函数实现随机黑白格子效果
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    // strength = random(vec2(strength, strength));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 21、根据 length 函数返回向量长度，以左下角为原点（以左下为原点渐变）
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 22、根据 distance 函数计算两个向量距离，以中心点为距离（以中心为原点渐变）
    // float strength = distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 23、相除实现光晕效果（把最后 - 1.0 去掉则是矩形包含光晕效果）
    // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 24、设置 vUv 水平或竖直变量设置压缩效果
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0), vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // // 25、根据 23、24 实现十字交叉效果（* 改为 + 则是四角星效果）
    // float distanceX = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // float distanceY = 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // float strength = distanceX * distanceY;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 25、根据 25 实现四角星旋转效果
    vec2 rotateUv = rotate(vUv, 3.14 * uTime, vec2(0.5, 0.5));
    float distanceX = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    float distanceY = 0.15 / distance(vec2(rotateUv.y, (rotateUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    float strength = distanceX + distanceY;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
  }
`;

export default fragmentShader;
