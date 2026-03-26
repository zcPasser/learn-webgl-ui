import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { DemoModule } from './index'

export default {
  title: '几何体变换',
  setup: (container: HTMLElement) => {
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
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 0, 0)
    /*
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    /*
     * Mesh-Cube, Mesh-Cylinder, Mesh-Cone
     */
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff)
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32)
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xff0000)
    })
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
    scene.add(cylinder)
    cylinder.position.set(2, 0, 0)
    const ConeGeometry = new THREE.ConeGeometry(1, 1, 32)
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x00ff00)
    })
    const cone = new THREE.Mesh(ConeGeometry, coneMaterial)
    scene.add(cone)
    cone.position.set(-2, 0, 0)
    /*
     * Light
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    /*
     * AxesHelper, GridHelper
     */
    scene.add(new THREE.AxesHelper(5))
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)
    gridHelper.position.y = -0.5
    /*
     * OrbitControls
     */
    const orbitalControls = new OrbitControls(camera, renderer.domElement)
    /*
     * Animate
     */
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime

      cube.rotation.x += 0.02
      // cylinder.rotation.z += Math.sin(elapsedTime) + 1
      // cone.rotation.y += Math.sin(elapsedTime) * 0.5

      orbitalControls.update()

      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    const startTime = Date.now()

    return {
      scene,
      camera,
      renderer,
      animate
    }
  }
} as DemoModule
