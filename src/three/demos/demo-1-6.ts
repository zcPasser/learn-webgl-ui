import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
export default {
  title: '物理模拟',
  setup: async (container: HTMLElement) => {
    /*
     * State
     */
    const sceneState = {
      useCamera2: false,
      velocity: new THREE.Vector3(0, 0, 0),
      g: new THREE.Vector3(0, -9.8, 0),
      radius: 1
    }
    const guiState = {
      useCamera2: false,
      restitution: 0.75
    }
    /*
     * Init: Scene & Camera & Renderer
     */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(4, 1, 5)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    /*
     * Control
     */
    const controls = new OrbitControls(camera, renderer.domElement)
    /*
     * Light
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    /*
     * Event
     */
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    renderer.domElement.addEventListener('resize', handleResize)
    // plane
    const textureLoader = new THREE.TextureLoader()
    const texture = await textureLoader.loadAsync(
      '/src/assets/red_brick_1k/red_brick_diff_1k.jpg'
    )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 10)
    const planeGeometry = new THREE.PlaneGeometry(100, 100)
    const planeMaterial = new THREE.MeshStandardMaterial({ map: texture })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)
    const sphereGeometry = new THREE.SphereGeometry(sceneState.radius, 32, 32)
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)
    sphere.position.set(0, 2, 0)
    /*
     * Animation
     */
    const clock = new THREE.Clock()
    let lastTime = clock.getElapsedTime()
    const position = sphere.position.clone()
    const floorNormal = new THREE.Vector3(0, 1, 0)
    const animate = () => {
      requestAnimationFrame(animate)
      // time
      const time = clock.getElapsedTime()
      const deltaTime = time - lastTime
      lastTime = time
      // algorithm
      sceneState.velocity.addScaledVector(sceneState.g, deltaTime)
      position.addScaledVector(sceneState.velocity, deltaTime)
      if (position.y - sceneState.radius < 0) {
        position.y = sceneState.radius
        const velocityNormal = sceneState.velocity.dot(floorNormal)
        // 「沿地面法线」的速度分量；vn < 0 表示往地面里撞
        if (velocityNormal < 0) {
          const e = guiState.restitution
          sceneState.velocity.addScaledVector(
            floorNormal,
            -(1 + e) * velocityNormal
          )
        }
      }
      sphere.position.copy(position)
      // update
      controls.update()
      renderer.render(scene, camera)
    }
    /*
     * Helper
     */
    // AxesHelper
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    /*
     * GUI
     */
    const gui = new GUI()
    gui.add(guiState, 'useCamera2')
    /*
     * Dispose
     */
    const dispose = () => {
      controls.dispose()
      renderer.dispose()
    }
    return {
      animate,
      dispose
    }
  }
}
