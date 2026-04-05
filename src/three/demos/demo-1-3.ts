import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export default {
  title: '相机控制',
  setup: (container: HTMLCanvasElement) => {
    /*
     * Debug Config
     */
    const debugConfig = {
      useCamera2: false
    }
    /*
     * GUI Config
     */
    const guiConfig = {}
    /*
     * Scene + Camera + Renderer
     */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    /*
     * debugCamera
     */
    let camera2: THREE.PerspectiveCamera | undefined
    if (debugConfig.useCamera2) {
      camera2 = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      )
      camera2.position.z = 5
      scene.add(camera2)
    }
    /*
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)
    /*
     * Controls
     */
    const controls = new OrbitControls(
      debugConfig.useCamera2 ? camera2! : camera,
      renderer.domElement
    )
    controls.enableDamping = true
    /*
     * Animation
     */
    const animate = (elapsedTime: number) => {
      console.log(elapsedTime)
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    /*
     * GUI
     */
    const gui = new GUI()
    /*
     * Dispose
     */
    const dispose = () => {
      controls.dispose()
      renderer.dispose()
      gui.destroy()
    }

    return {
      animate,
      dispose
    }
  }
}
