# GLSL 相关内容

## 程序主结构

```glsl
#version 400

in vec3 vertCol;
out vec4 fragColor;

void main()
{
    fragColor = vec4( vertCol, 1.0 );
}
```

### 指定语法版本

指定 `GLSL` 编译器版本为 `GLSL3.3`，并要求编译器支持扩展语法 `include`：

```glsl
#version 330 core
#extension GL_ARB_shading_language_include : require
```

- `version` 指定编译器版本
- `extension` 指定编译器对特定扩展语法的行为

  > 指定扩展语法的方法: `#extension extension_name|all : behavior`

  - `require`
  - `enable`
  - `warn`
  - `disable`

### 入口函数

main 函数，且无返回值

### 输入输出

- 传入
  - `in`
  - `uniform`
  - `buffer`
- 输出
  - `out`
  - `buffer`

### 变量命名

字母、数字和下划线，但不可以数字开头，不可以 `gl_` 开头

> `gl_` 开头是 `GLSL` 内部变量

## 执行单位

在 GPU 上执行，程序不按照代码顺序执行，而是在不影响程序输出结果的情况下，经过编译期指令重排、运行期指令乱序发射的方式乱序执行

## GLSL 宏

### 预处理指令

- `#define`
- `#undef`
- `#if`
- `#ifdef`
- `#ifndef`
- `#elif`
- `#else`
- `#endif`
- `#pragma`
- `#error`

> 注意：`GLSL` 不支持 `#include`

_`#line`_ 用法：

```glsl
#line line
#line line source-string-number

// 例子：
// 3 是下一行的行号
#line 3
// 3是下一行的行号，40是下一行的文件号
#line 3 40
```

### 常见宏常量

- `__LINE__` 当前行号，行号起始号可通过 `#line` 定义
- `__FILE__` 当前文件名
- `__VERSION__` 当前 GLSL 版本

## 数据类型

### 基本类型

| 标量类型 | 二维向量 | 三维向量 | 四维向量 | 矩阵类型                  |
| -------- | -------- | -------- | -------- | ------------------------- |
| float    | vec2     | vec3     | vec4     | mat2, mat3, mat4          |
|          |          |          |          | mat2x2, mat2x3, mat2x4    |
|          |          |          |          | mat3x2, mat3x3, mat3x4    |
|          |          |          |          | mat4x2, mat4x3, mat4x4    |
| double   | dvec2    | dvec3    | dvec4    | dmat2, dmat3, dmat4       |
|          |          |          |          | dmat2x2, dmat2x3, dmat2x4 |
|          |          |          |          | dmat3x2, dmat3x3, dmat3x4 |
|          |          |          |          | dmat4x2, dmat4x3, dmat4x4 |
| int      | ivec2    | ivec3    | ivec4    | -                         |
| uint     | uvec2    | uvec3    | uvec4    | -                         |
| bool     | bvec2    | bvec3    | bvec4    | -                         |

#### 类型转换

`GLSL` 是强类型语言，必须进行显式的强制类型转换

```glsl
// 错误，不能自动类型转换
int b = 2.0;
// 正确
int b = int(2.0);

int a = 2;
// 正确，c = 2.0
float c = float(a);
```

#### 向量类型

##### 特殊语法

`swizzling（搅拌式访问）`：指可以使用 `x`、`y`、`z`、`w` 分别指代向量类型的第 1、2、3、4 个元素：

```glsl
vec2 somVec;
vec4 otherVec = someVec.xyxx;
vec3 thirdVec = otherVec.zyy;
vec4 someVec;

someVec.rgba = vec4(1.0, 2.0, 3.0, 4.0);
someVec.zx = vec2(3.0, 5.0);
```

另外，向量的元素还可使用下列字母组访问，根据向量的语义，使用不同组字母：

| \[1\] | \[2\] | \[3\] | \[4\] | 说明         |
| ----- | ----- | ----- | ----- | ------------ |
| x     | y     | z     | w     | 表示顶点坐标 |
| s     | t     | p     | q     | 表示纹理坐标 |
| r     | g     | b     | a     | 表示颜色     |

##### 初始化、赋值

```glsl
vec2 a = vec2(1.0, 2.0);
vec2 b = vec2(3.0, 4.0);
// c = vec4(1.0, 2.0, 3.0, 4.0);
vec4 c = vec4(a, b);
vec2 g = vec2(1.0, 2.0);
float h = 3.0;
// j = vec3(1.0, 2.0, 3.0);
vec3 j = vec3(g, h);
vec4 color;
vec3 RGB = vec3(color);
vec3 white = vec3(1.0);
vec4 translucent = vec4(white, 0.5);
```

##### 访问

```glsl
vec4 a = vec4(1.0, 2.0, 3.0, 4.0);
// 下标方式
float posY = a[1];
// 名称方式（选择子方式）
float posX = a.x;
vec2 posXY = a.xy;
float depth = a.w;

// 搅拌式访问
vec3 color = vec3(1.0, 0.0, 0.0);
vec3 luminance = color.rrr;
color = color.bgr;
```

#### 矩阵类型

`mat2` - 2\*2 矩阵，以此类推。

矩阵只有浮点型，列优先顺序。

```glsl
// 初始化一个对角线矩阵
mat4 m = mat4(1.0);

vec2 a = vec2(1.0, 2.0);
vec2 b = vec2(2.0, 4.0);
// 列优先排序
mat2 n = mat2(a, b);

mat2 k = mat(1.0, 2.0, 3.0, 4.0);
mat3 M = mat3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0);

vec3 column1 = vec3(1.0, 2.0, 3.0);
vec3 column2 = vec3(4.0, 5.0, 6.0);
vec3 column3 = vec3(7.0, 8.0, 9.0);
mat3 matrix = mat3(column1, column2, column3);

vec2 column4 = vec2(1.0, 2.0);
vec2 column5 = vec2(4.0, 5.0);
vec2 column6 = vec2(7.0, 8.0);
mat3 matrix2 = mat3(column4, 3.0, column5, 6.0, column6, 9.0);
```

访问矩阵类型：

```glsl
// 对角线矩阵
mat4 m = mat4(1.0);
// a 为 2 列 3 行数据
float a = m[2][3];
// b 为 第 2 列
vec4 b = matrix[2]
```

### 结构体类型

初始化：

```glsl
struct Light
{
  vec3 eyePosition;
  vec3 intensity;
  float attenuation;
};

Light light = Light(vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), 1.0);
```

### 数组类型

```glsl
float myValues[2];
```

> `GLSL 3.30` 前的版本前不支持 `opaque` 类型数组；<br /> `GLSL 3.30` 开始支持 `Sampler` 类型数组，但索引必须是常量表达式；<br /> `GLSL 4.00` 开始支持 `opaque` 类型数组，但 `opaque` 数组索引必须是 `dynamically uniform` 表达式；

- 可以像 `C` 一样声明和访问数组
- 只支持一维数组
- 下标不可为负

初始化和访问：

```glsl
float a[3] = float[3](1.0, 2.1, 3.5);

for(int i = 0; i < a.length(); i++) {
  a[i] *= 2.0;
}
```

### `opaque` 类型

代表着色器以某种方式引用的一些外部对象，主要包括纹理、图像和原子计数器。

- 纹理
  - sampler1D 一维纹理采样器
  - sampler2D 二维纹理采样器
  - sampler3D 三维纹理采样器
  - samplerCube 立方体纹理采样器
  - sampler1DArray 一维数组纹理采样器
  - sampler2DArray 二维数组纹理采样器
- 图像
  - image1D 一维图像
  - image2D 二维图像
  - image3D 三维图像
  - imageCube 立方体图像
  - image1DArray 一维数组图像
  - image2DArray 二维数组图像
- 原子计数器
  - atomic_uint 原子计数器

> 纹理只读，读操作时会进行纹理过滤；图像可读写，读写过程不进行过滤操作

### 接口块类型

Interface Block 是成组的输入输出变量，格式：

```glsl
storage_qualifier block_name
{
  <define members here>
} instance_name
```

其中，`storage_qualifier` 可以是 `in`、`out`、`uniform`、`buffer`，例如：

```glsl
uniform MatrixBlock
{
  mat4 projection;
  mat4 modelview;
} matrices;
```

> 和结构体的区别是结构体内的成员是供`shader`程序内部使用的，接口块内的成员是用于`shader`程序输入输出的。

### 初始化

可通过构造器、初始化列表、赋值运算符初始化：

```glsl
struct Data {
  float first;
  vec2 second;
}

// 构造器
bool val = bool(true);
const float array[3] = float[3](1.0, 2.0, 3.0);
Data dataValue = Data(1.0, vec2(2.0, 3.0));

// 初始化列表
bool val = {true};
const float array[3] = {1.0, 2.0, 3.0};
Data dataValue = {1.0, {-19.0, 4.5}};
```

> 用作输入输出的变量不允许初始化，如 `in`、`out` 等关键字修饰的变量

限定符：

- `const` 声明一个只读变量
- `uniform` 不随图元变化的全局变量，只读
- `in` VS 中为输入的顶点属性，FS 中为片段属性，只读
- `out` VS 中输出的顶点属性，可读写
- `centroid`、`smooth`、`flat`、`nonperspective` 限定插值方式

## 表达式

### 常量表达式

```glsl
// literal
1.0;
// operator
1.0 + 2.0;
// constructor
vec2(1.0, 2.0);
// const
const float val = {1.0};
```

### `dynamically uniform` 表达式

## 控制流

- `if-else`
- `switch-case`
- `for`
- `while`
- `do-while`
- `break`
- `continue`
- `return`
- `discard` - 仅用于片元着色器，调用会引起程序退出，不会输出片元值
  > `discard` 和 `return` 区别：`discard` 和在 `main` 函数内使用 `return` 都会引起程序退出，前者不会输出片元值，后者会输出片元值

## 函数

`GLSL` 函数不支持递归，参数限定符是 `in`、`out`、`inout`、`const in`

| 限定符   | 说明                                                             |
| -------- | ---------------------------------------------------------------- |
| in       | 缺省时默认的限定符，指明参数通过值传递                           |
| out      | 指明参数值不可读，但在函数返回时可以写                           |
| inout    | 指明参数通过引用传递，可读                                       |
| const in | 指明参数通过值传递，且传入的值不可修改，给编译器提供更多优化空间 |

### 返回值

#### 使用 `out` 参数返回数据

```glsl
void computeData(out vec3 result)
{
  result = ...;
}

void main() {
  vec3 outputData;
  computeData(outputData);
  // outputData 中包含了在函数 computeData 中计算的数据
}
```

`computeData` 函数通过 `out` 参数将结果写入 `result` 参数，然后调用时传入一个变量，函数将结果写入这个变量中。

#### 使用函数返回值返回数据 (`return`)

```glsl
vec3 computeData()
{
  return ...;
}

void main()
{
  vec3 outputData = computeData();
  // outputData 中包含了在函数 computeData 中计算的数据
}
```

`computeData` 函数直接返回一个 `vec3` 类型的值，调用时将返回值赋给 `outputData` 变量。

#### 区别

- 使用 `out` 参数可以返回多个值
- 使用函数返回值 `return` 更符合直观的编程风格，特别是当函数只需要返回一个值时

### `subroutine`

使用条件语句选择性地调用不同的子函数
