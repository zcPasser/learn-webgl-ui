import * as THREE from 'three'
import type { DemoModule } from './index'
import vertexShader from '@/shaders/demos/demo-1-1/vertex.glsl'
import fragmentShader from '@/shaders/demos/demo-1-1/fragment.glsl'

export default {
  title: 'Shader 渐变立方体',
  setup: (
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
  ) => {
    // 创建自定义 Shader 材质
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0xff3366) },
        uColorB: { value: new THREE.Color(0x33ff66) }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide
    })

    // 创建几何体
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
    const cube = new THREE.Mesh(geometry, shaderMaterial)
    scene.add(cube)

    // 添加一个简单的轨道控制（可选，这里为了演示不引入额外依赖）
    // 存储 cube 引用以便在 animate 中使用
    ;(window as any).__demoCube = cube
    ;(window as any).__shaderMaterial = shaderMaterial
  },
  animate: (deltaTime: number, currentTime: number) => {
    const cube = (window as any).__demoCube
    const material = (window as any).__shaderMaterial

    if (cube) {
      // 旋转立方体
      cube.rotation.x += 0.005
      cube.rotation.y += 0.01
    }

    if (material) {
      // 更新时间 uniform
      material.uniforms.uTime.value = currentTime * 0.001
    }
  },
  dispose: () => {
    delete (window as any).__demoCube
    delete (window as any).__shaderMaterial
  }
} as DemoModule
