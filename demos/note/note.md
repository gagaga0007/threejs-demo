# 备忘录

## 渲染管线

渲染管线的作用是将 3D 模型转换为二维图像。

现代 GPU 所包含的渲染管线为可编程渲染管线，通过编程 GLSL 着色器语言控制一些渲染阶段的细节（使用 shader 对画布中每个像素点做处理）。

> 顶点数据 -> 顶点着色器 -> 形状装配 -> 几何着色器 -> 光栅化 -> 片段着色器 -> 测试与混合

## 图元装配和光栅化

### 图元

描述各种图形元素的函数叫图元，描述几何元素的称作几何图元（点、线、多边形），经过顶点着色器计算后的坐标会组装为组合图元。

如三角形，则顶点着色器就会执行三次。

> 图元装配：就是将我们设置的顶点、颜色、纹理等内容组装成为一个可渲染的多边形的过程。

### 光栅化

通过图元装配生成的多边形，计算像素并补充，剔除不可见部分，裁剪掉不在可视范围内的部分，最终生成可见的带有颜色数据的图形并绘制。

> 剔除：物体不可见部分会在渲染过程中被剔除，不参与绘制，节省渲染开销。
>
> 剪裁：在可视范围外的物体会被剪裁，不参与绘制，提高性能。

光栅化后，每一个像素点都包含了颜色、深度、纹理数据，称为片元。

片元着色器运行的次数由图形有多少个片元决定的。

### 逐片元挑选

通过一系列测试确定片元是否要显示，测试过程中会丢弃部分无用的片元内容，然后生成可绘制的二维图像绘制并显示。

#### 深度测试

对 z 轴的值进行测试，值比较小的片元内容会覆盖值比较大的（近处遮挡远处）。

#### 模板测试

模拟观察者的观察行为（镜像观察），标记所有镜像中出现的片元，最后只绘制有标记的内容。

## 开始

需要四个元素：

- 包含对象的场景
- 一些物体
- 相机
- 渲染器

### 场景

```javascript
const scene = new THREE.Scene();
```

### 对象

```javascript
// 创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 设置属性
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建网格
const cube = new THREE.Mesh(geometry, material);
// 添加到场景
scene.add(cube);
```

### 相机

渲染场景时，将从相机的视角开始渲染，相机会决定场景中哪些内容可见。

需要两个基本参数：

- 视野范围

  指视角有多大

- 纵横比

  指宽高比，即宽度和高度的比例

```javascript
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 5;
// 添加到场景
scene.add(camera);
```

### 渲染器

渲染器负责将场景渲染到画布上。

```javascript
const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
```

#### 第一次渲染

使用 `render(...)`，参数为 `scene` 和 `camera`。

```javascript
renderer.render(scene, camera);
```

#### 添加动画

使用 `requestAnimationFrame(...)` 实现动画效果。

```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```
