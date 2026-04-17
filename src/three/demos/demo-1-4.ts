import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export default {
  title: '纹理应用与动态材质系统',
  setup: (
    container: HTMLElement,
    loadingOverlay: HTMLElement,
    updateProgressBar: (progress: number) => void
  ) => {
    /*
     * State
     */
    const state = {
      repeatX: 4,
      repeatY: 1
    }
    /*
     * GUI State
     */
    const guiState = {}
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
    scene.add(camera)
    camera.position.set(1, 1, 2.0)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    /*
     * Controls: OrbitControls
     */
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    /*
     * Mesh
     */
    // texture
    const setTextureRepeat = (
      texture: THREE.Texture,
      repeatX: number,
      repeatY: number
    ) => {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeatX, repeatY)

      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      console.log(texture.minFilter, texture.magFilter)
      console.log(THREE.LinearFilter)
    }
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onProgress = (url, loaded, total) => {
      // console.log('loading texture', url, loaded, total)
      const progress = (loaded / total) * 100
      updateProgressBar(progress)
    }
    loadingManager.onLoad = () => {
      console.log('all textures loaded')

      // 检查 canvas 元素
      console.log('Canvas element:', renderer.domElement)
      console.log(
        'Canvas pointer-events:',
        getComputedStyle(renderer.domElement).pointerEvents
      )
      console.log(
        'Container pointer-events:',
        getComputedStyle(container).pointerEvents
      )

      // 测试 OrbitControls 状态
      console.log('OrbitControls enabled:', orbitControls.enabled)
      if (loadingOverlay) {
        // loadingOverlay.style.display = 'none'
        orbitControls.dispose() // 先清理旧的事件监听
        updateProgressBar(100)
      }
      renderer.render(scene, camera)
    }

    const textureLoader = new THREE.TextureLoader(loadingManager)
    const colorTexture = textureLoader.load(
      '/src/assets/red_brick_1k/red_brick_diff_1k.jpg',
      () => {
        console.log('loaded red_brick_diff_1k')
        // material.map = colorTexture
        // material.needsUpdate = true
        renderer.render(scene, camera)
      },
      undefined,
      (error) => {
        console.log('error load red_brick_diff_1k', error)
      }
    )
    const normalTexture = textureLoader.load(
      '/src/assets/red_brick_1k/red_brick_nor_dx_1k.jpg',
      () => {
        console.log('loaded red_brick_normal_1k')
        // material.normalMap = normalTexture
        // material.needsUpdate = true
      },
      undefined,
      (error) => {
        console.log('error load red_brick_normal_1k', error)
      }
    )
    const roughTexture = textureLoader.load(
      '/src/assets/red_brick_1k/red_brick_rough_1k.jpg',
      () => {
        console.log('loaded red_brick_rough_1k')
        // material.roughnessMap = roughTexture
        // material.needsUpdate = true
      },
      undefined,
      (error) => {
        console.log('error load red_brick_rough_1k', error)
      }
    )
    setTextureRepeat(colorTexture, state.repeatX, state.repeatY)
    setTextureRepeat(normalTexture, state.repeatX, state.repeatY)
    setTextureRepeat(roughTexture, state.repeatX, state.repeatY)
    const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    material.map = colorTexture
    material.normalMap = normalTexture
    material.roughnessMap = roughTexture
    /*
     * Light: AmbientLight
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(2, 1, 5)
    scene.add(directionalLight)
    const pointLight = new THREE.PointLight(0xffffff, 1.5)
    pointLight.position.set(-1, 1, -1.5)
    scene.add(pointLight)
    /*
     * Helper: AxesHelper, GridHelper
     */
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    axesHelper.position.y = 0.5
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      1
    )
    scene.add(directionalLightHelper)
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
    scene.add(pointLightHelper)
    /*
     * Animation
     */
    const clock = new THREE.Clock()
    let lastTime = clock.getElapsedTime()
    let animateId: number
    const animate = () => {
      animateId = requestAnimationFrame(animate)
      // time
      const currentTime = clock.getElapsedTime()
      const deltaTime = currentTime - lastTime
      // algorithm
      // update
      orbitControls.update()
      renderer.render(scene, camera)
      lastTime = currentTime
    }
    /*
     * GUI
     */
    const gui = new GUI()
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'x').min(-5).max(5).step(0.01)
    cameraFolder.add(camera.position, 'y').min(-5).max(5).step(0.01)
    cameraFolder.add(camera.position, 'z').min(-5).max(5).step(0.01)
    /*
     * Dispose
     */
    const dispose = () => {
      cancelAnimationFrame(animateId)
      orbitControls.dispose()
      axesHelper.dispose()
      renderer.dispose()
    }
    return {
      animate,
      dispose
    }
  }
}
