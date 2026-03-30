import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { DemoModule } from './index'

export default {
  title: '光照实验',
  setup: (container: HTMLCanvasElement) => {
    /*
     * Scene
     */
    const scene = new THREE.Scene()

    /*
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    scene.add(camera)

    /*
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    /*
     * Controls
     */
    const controls = new OrbitControls(camera, renderer.domElement)

    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
  }
}
