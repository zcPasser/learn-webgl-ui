import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { createPlainText } from '../utils/textUtil.js'

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
     * GUI Config
     */
    const guiConfig = {
      bulbLight: {
        lightIntensity: 10,
        emissiveIntensity: 10,
        speed: 0.001,
        lightColor: 0xffee88
      }
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
      45,
      container.clientWidth / container.clientHeight,
      2.2,
      18
    )
    camera.position.set(-0.05, 2.9, 12.12)
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
     * Text Label
     */
    const createTextLabel = (text: string) => {
      const canvas = createPlainText(text)

      // 创建纹理
      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true

      canvas.remove()

      // 创建材质
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      })

      // 创建精灵
      const sprite = new THREE.Sprite(material)

      const aspect = canvas.width / canvas.height
      const baseScale = 1
      sprite.scale.set(aspect * baseScale, baseScale, 1) // 调整大小

      return sprite
    }
    /*
     * Mesh
     */
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: 0x585050,
      side: THREE.DoubleSide
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
    ground.receiveShadow = true
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    const sphereMaterial1 = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    })
    const sphereMaterial2 = new THREE.MeshStandardMaterial({
      color: 0xff0000
    })
    const sphereMaterial3 = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    })
    const sphereMaterial4 = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff
    })
    /*
     * Group1
     */
    const label1 = createTextLabel('sphere1 LambertMaterial')
    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1)
    const group1 = new THREE.Group()
    group1.add(label1)
    group1.add(sphere1)
    scene.add(group1)
    group1.position.set(0, 1.1, 0)
    label1.position.set(0, 1.5, 0)
    sphere1.position.set(0, 0, 0)
    sphere1.castShadow = true
    /*
     * Group2
     */
    const label2 = createTextLabel('sphere2 StandardMaterial')
    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2)
    const group2 = new THREE.Group()
    group2.add(label2)
    group2.add(sphere2)
    scene.add(group2)
    group2.position.set(3, 1.1, 0)
    label2.position.set(0, 1.5, 0)
    sphere2.position.set(0, 0, 0)
    sphere2.castShadow = true
    /*
     * Group3
     */
    const label3 = createTextLabel('sphere3 PhongMaterial')
    const sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial3)
    const group3 = new THREE.Group()
    group3.add(label3)
    group3.add(sphere3)
    scene.add(group3)
    group3.position.set(-3, 1.1, 0)
    label3.position.set(0, 1.5, 0)
    label3.rotation.x = Math.PI / 2
    sphere3.position.set(0, 0, 0)
    sphere3.castShadow = true
    /*
     * Group4
     */
    const label4 = createTextLabel('sphere4 MeshPhysicalMaterial')
    const sphere4 = new THREE.Mesh(sphereGeometry, sphereMaterial4)
    const group4 = new THREE.Group()
    group4.add(label4)
    group4.add(sphere4)
    scene.add(group4)
    group4.position.set(0, 1.1, 3)
    label4.position.set(0, 1.5, 0)
    sphere4.position.set(0, 0, 0)
    sphere4.castShadow = true

    /*
     * Light
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 3, -2)
    scene.add(directionalLight)
    directionalLight.castShadow = true
    // Bulb
    const bulbGeometry = new THREE.SphereGeometry(0.2, 16, 16)
    const bulbLight = new THREE.PointLight(
      guiConfig.bulbLight.lightColor,
      guiConfig.bulbLight.lightIntensity,
      500,
      2
    )

    const bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: guiConfig.bulbLight.emissiveIntensity,
      color: 0x000000
    })
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat))
    bulbLight.position.set(3, 2.1, -2)
    bulbLight.castShadow = true
    scene.add(bulbLight)

    /*
     * Helper
     */
    let cameraHelper: THREE.CameraHelper | undefined
    if (debugConfig.useCamera2) {
      cameraHelper = new THREE.CameraHelper(camera)
      scene.add(cameraHelper)
      // cameraHelper.visible = true
    }
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      1
    )
    scene.add(directionalLightHelper)
    const directionalLightShadowHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    )
    // scene.add(directionalLightShadowHelper)
    const pointLightHelper = new THREE.PointLightHelper(bulbLight, 1)
    // scene.add(pointLightHelper)
    const pointLightShadowHelper = new THREE.CameraHelper(
      bulbLight.shadow.camera
    )
    // scene.add(pointLightShadowHelper)
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    /*
     * Animation
     */
    const animate = (elapsed: number) => {
      requestAnimationFrame(animate)

      bulbLight.position.x = Math.cos(elapsed * guiConfig.bulbLight.speed) * 3
      bulbLight.position.y =
        Math.sin(elapsed * guiConfig.bulbLight.speed) * 3 + 3

      controls?.update()
      debugConfig.useCamera2 && cameraHelper?.update()
      renderer.render(scene, debugConfig.useCamera2 ? camera2 : camera)
    }

    /*
     * GUI
     */
    const gui = new GUI()
    // 相机
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
        cameraHelper && (cameraHelper.visible = true)
      })
    cameraFolder
      .add(camera, 'near', 0.1, 10, 0.1)
      .name('近裁切面')
      .onChange(() => {
        camera.updateProjectionMatrix()
        cameraHelper && (cameraHelper.visible = true)
      })
    cameraFolder
      .add(camera, 'far', 10, 200, 1)
      .name('远裁切面')
      .onChange(() => {
        camera.updateProjectionMatrix()
        cameraHelper && (cameraHelper.visible = true)
      })
    cameraFolder.close()
    // bulbLight
    const bulbLightFolder = gui.addFolder('BulbLight')
    bulbLightFolder
      .add(guiConfig.bulbLight, 'lightIntensity', 0, 100, 0.1)
      .onChange((value) => {
        bulbLight.intensity = value
      })
    bulbLightFolder
      .add(guiConfig.bulbLight, 'emissiveIntensity', 0, 100, 0.1)
      .onChange((value) => {
        bulbMat.emissiveIntensity = value
      })
    bulbLightFolder
    bulbLightFolder
      .add(guiConfig.bulbLight, 'speed', 0.001, 0.1, 0.001)
      .onChange((value) => {
        guiConfig.bulbLight.speed = value
      })
    bulbLightFolder
      .addColor(guiConfig.bulbLight, 'lightColor')
      .onChange((value) => {
        bulbLight.color.set(value)
      })
    bulbLightFolder.close()

    console.log('scene', scene)

    return {
      animate
    }
  }
}
