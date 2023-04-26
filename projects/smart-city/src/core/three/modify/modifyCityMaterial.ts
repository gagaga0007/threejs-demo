import * as THREE from 'three'
import gsap from 'gsap'

export const modifyCityMaterial = (mesh: any) => {
  mesh.material.onBeforeCompile = (shader: any) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
        #include <dithering_fragment>
        //#end#
      `
    )
    addGradColor(shader, mesh)

    addSpread(shader) // 从中心扩散的光圈
    addLightLine(shader) // 从左上到右下的直线光条
    addToTopLine(shader) // 从底部向上的光
  }
}

export const addGradColor = (shader: any, mesh: any) => {
  mesh.geometry.computeBoundingBox()

  const { min, max } = mesh.geometry.boundingBox
  // 获取物体的高度差
  const uHeight = max.y - min.y

  shader.uniforms.uTopColor = { value: new THREE.Color('#aaaeff') }
  shader.uniforms.uHeight = { value: uHeight }

  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>
      varying vec3 vPosition;
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      vPosition = position;
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>
      
      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
      vec4 distGradColor = gl_FragColor;

      // 设置混合的百分比
      float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
      // 计算出混合颜色
      vec3 gradMixColor = mix(distGradColor.xyz, uTopColor, gradMix);
      gl_FragColor = vec4(gradMixColor, 1);
      
      //#end#
    `
  )
}

// 添加建筑材质光波扩散特效
export const addSpread = (shader: any, center = new THREE.Vector2(0, 0)) => {
  // 设置扩散的中心点
  shader.uniforms.uSpreadCenter = { value: center }
  // 扩散的时间
  shader.uniforms.uSpreadTime = { value: -2000 }
  // 设置条带的宽度
  shader.uniforms.uSpreadWidth = { value: 40 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>

      uniform vec2 uSpreadCenter;
      uniform float uSpreadTime;
      uniform float uSpreadWidth;
      `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
     float spreadRadius = distance(vPosition.xz, uSpreadCenter);
      //  扩散范围的函数
      float spreadIndex = -(spreadRadius-uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;

      if (spreadIndex > 0.0) {
        gl_FragColor = mix(gl_FragColor,vec4(1, 1, 1, 1), spreadIndex / uSpreadWidth);
      }

      //#end#
    `
  )

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800,
    duration: 3,
    ease: 'none',
    repeat: -1
  })
}

export const addLightLine = (shader: any) => {
  // 扩散的时间
  shader.uniforms.uLightLineTime = { value: -1500 }
  // 设置条带的宽度
  shader.uniforms.uLightLineWidth = { value: 200 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>
  
      uniform float uLightLineTime;
      uniform float uLightLineWidth;
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
      float LightLineMix = -(vPosition.x + vPosition.z - uLightLineTime) * (vPosition.x + vPosition.z - uLightLineTime) + uLightLineWidth;
  
      if (LightLineMix > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(0.8, 1.0, 1.0, 1), LightLineMix / uLightLineWidth);
      }
  
      //#end#
    `
  )

  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 5,
    ease: 'none',
    repeat: -1
  })
}

export const addToTopLine = (shader: any) => {
  // 扩散的时间
  shader.uniforms.uToTopTime = { value: 0 }
  // 设置条带的宽度
  shader.uniforms.uToTopWidth = { value: 40 }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
      #include <common>
    
      uniform float uToTopTime;
      uniform float uToTopWidth;
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    `
      float ToTopMix = -(vPosition.y - uToTopTime) * (vPosition.y - uToTopTime) + uToTopWidth;
    
      if (ToTopMix > 0.0) {
        gl_FragColor = mix(gl_FragColor, vec4(0.8, 0.8, 1, 1), ToTopMix / uToTopWidth);
      }

      //#end#
    `
  )

  gsap.to(shader.uniforms.uToTopTime, {
    value: 500,
    duration: 3,
    ease: 'none',
    repeat: -1
  })
}
