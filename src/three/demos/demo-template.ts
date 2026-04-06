import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { createInfoElement } from '../utils/infoUtil'

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
    const guiConfig = {
      ground: {
        color: 0x666b66
      }
    }
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
    camera.position.set(0, 10, 15)
    camera.lookAt(0, 0, 0)
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
     * Mesh
     */
    /*
     * Info
     */
    const infoInnerHTML = `
      <div>信息提示</div>
    `
    const infoElement = createInfoElement(infoInnerHTML)
    container.appendChild(infoElement)
    /*
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
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
     * Event
     */
    const handleKeydown = (event: KeyboardEvent) => {
      // if (event.key === 'w') {
      //   camera.position.z += 1
      // } else if (event.key === 's') {
      //   camera.position.z -= 1
      // } else if (event.key === 'a') {
      //   camera.position.x -= 1
      // } else if (event.key === 'd') {
      //   camera.position.x += 1
      // } else if (event.key === 'q') {
      //   camera.position.y += 1
      // } else if (event.key === 'e') {
      //   camera.position.y -= 1
      // }
    }
    window.addEventListener('keydown', handleKeydown)
    /*
     * Animation
     */
    let animationId: number | undefined = undefined
    const animate = (elapsedTime: number) => {
      // console.log(elapsedTime)
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    /*
     * AxesHelper, GridHelper
     */
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)
    gridHelper.position.set(0, 0.2, 0)
    /*
     * GUI
     */
    const gui = new GUI()
    gui.add(debugConfig, 'useCamera2').name('调试相机')
    /*
     * Dispose
     */
    const dispose = () => {
      controls.dispose()
      renderer.dispose()
      gui.destroy()
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      animationId = undefined
    }
    console.log('scene', scene)

    return {
      animate,
      dispose
    }
  }
}
