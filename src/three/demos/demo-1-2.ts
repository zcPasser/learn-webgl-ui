import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export default {
  title: '光照实验',
  setup: (container: HTMLCanvasElement) => {
    /*
     * Debug Config
     */
    const debugConfig = {
      useCamera2: false
    }
    /*
     * Scene
     */
    const scene = new THREE.Scene()

    /*
     * Camera
     */
    const aspect = container.clientWidth / container.clientHeight
    const camera = new THREE.PerspectiveCamera(
      20,
      container.clientWidth / container.clientHeight,
      2.2,
      18
    )
    camera.position.set(-0.05, 2.9, 11.75)
    camera.rotation.x = -0.241
    scene.add(camera)
    const frustumSize = 12
    const camera2 = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.5,
      50
    )
    camera2.position.set(0, 20, 20)
    camera2.lookAt(0, 0, 0)
    scene.add(camera2)

    /*
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    /*
     * Controls
     */
    const controls = new OrbitControls(
      debugConfig.useCamera2 ? camera2 : camera,
      renderer.domElement
    )
    controls.enableDamping = true
    /*
     * Mesh
     */
    const groundGeometry = new THREE.PlaneGeometry(10, 10)
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: 0x585050,
      side: THREE.DoubleSide
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
    const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
    const sphereMaterial1 = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    })
    const sphereMaterial2 = new THREE.MeshStandardMaterial({
      color: 0xff0000
    })
    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1)
    scene.add(sphere1)
    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2)
    scene.add(sphere2)
    /*
     * Light
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    // directionalLight.position.set(1, 1, 1)
    // scene.add(directionalLight)

    /*
     * Helper
     */
    let cameraHelper: THREE.CameraHelper | undefined
    if (debugConfig.useCamera2) {
      cameraHelper = new THREE.CameraHelper(camera2)
      scene.add(cameraHelper)
      // cameraHelper.visible = true
    }
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    /*
     * Animation
     */
    const animate = () => {
      requestAnimationFrame(animate)
      controls?.update()
      debugConfig.useCamera2 && cameraHelper?.update()
      renderer.render(scene, debugConfig.useCamera2 ? camera2 : camera)
    }

    /*
     * GUI
     */
    const gui = new GUI()
    const cameraFolder = gui.addFolder('相机')
    cameraFolder.add(camera.position, 'x', -15, 15, 0.01)
    cameraFolder.add(camera.position, 'y', -15, 15, 0.01)
    cameraFolder.add(camera.position, 'z', -15, 15, 0.01)
    // 相机朝向（旋转），直接调节视锥体指向
    cameraFolder
      .add(camera.rotation, 'x', -Math.PI, Math.PI, 0.001)
      .name('旋转 X')
    cameraFolder
      .add(camera.rotation, 'y', -Math.PI, Math.PI, 0.001)
      .name('旋转 Y')
    cameraFolder
      .add(camera.rotation, 'z', -Math.PI, Math.PI, 0.001)
      .name('旋转 Z')
    cameraFolder
      .add(camera, 'fov', 10, 120, 1)
      .name('视场角 FOV')
      .onChange(() => {
        camera.updateProjectionMatrix() // 必须更新投影矩阵
      })
    cameraFolder
      .add(camera, 'near', 0.1, 10, 0.1)
      .name('近裁切面')
      .onChange(() => {
        camera.updateProjectionMatrix()
      })
    cameraFolder
      .add(camera, 'far', 10, 200, 1)
      .name('远裁切面')
      .onChange(() => {
        camera.updateProjectionMatrix()
      })
    cameraFolder.close()

    console.log('scene', scene)

    return {
      animate
    }
  }
}
