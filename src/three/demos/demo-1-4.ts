import * as THREE from 'three'

export default {
  title: '纹理应用与动态材质系统',
  setup: (container: HTMLCanvasElement) => {
    /*
     * Init: Scene, Camera, Renderer
     */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
  }
}
