import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import vertexShader from '@/shaders/demos/demo-1-4/vertex.glsl'
import fragmentShader from '@/shaders/demos/demo-1-4/fragment.glsl'
import { createPlainText } from '@/three/utils/textUtil'

export default {
  title: '纹理应用与动态材质系统',
  setup: (container: HTMLElement) => {
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
    const guiState = {
      texture: {
        speedX: 0.01,
        speedY: 0.01,
        useU: true,
        useV: false,
        uMixFactor: 0.5
      }
    }
    /*
     * Loader
     */
    const createLoader = () => {
      const loaderContainer = document.createElement('div')
      loaderContainer.className = 'loader-container'
      loaderContainer.style = `
        width: 100vw;
        min-height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        background: rgba(0, 0, 0, 1);
        opacity: 1;
        transition: opacity 0.6s ease-in-out;
      `
      // loader progress bar container
      const loaderProgressBarContainer = document.createElement('div')
      loaderProgressBarContainer.className = 'loader-progress-bar-container'
      loaderContainer.appendChild(loaderProgressBarContainer)
      loaderProgressBarContainer.style = `
        width: 80%;
        height: 40px;
        border-radius: 20px;
        background: aliceblue;
        will-change: contents;
        transform: translateZ(0);
        transition: opacity 0.3s ease-in-out, transform 0.4s ease-in-out;
      `

      // loader progress bar
      const loaderProgressBar = document.createElement('div')
      loaderProgressBar.className = 'loader-progress-bar'
      loaderProgressBarContainer.appendChild(loaderProgressBar)
      loaderProgressBar.style = `
        width: 0%;
        height: inherit;
        border-radius: 25px;
        background: cornflowerblue;
        transition: width 1s ease-in-out;
        will-change: width, transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      `

      // loader animation
      const hideLoader = () => {
        setTimeout(() => {
          loaderContainer.style.opacity = '0'
          setTimeout(() => {
            loaderContainer.style.display = 'none'
          }, 600)
        }, 1100)
      }
      return {
        container: loaderContainer,
        progress: loaderProgressBar,
        hideLoader
      }
    }
    const loader = createLoader()
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
    camera.position.set(-0.29, 1, 4.14)
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
    }
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onProgress = (_url, loaded, total) => {
      const progress = (loaded / total) * 95
      loader.progress.style.width = `${progress}%`
    }
    loadingManager.onLoad = () => {
      console.log('all textures loaded')
      loader.progress.style.width = '100%'
      loader.hideLoader()

      renderer.render(scene, camera)
    }
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const colorTexture = textureLoader.load(
      '/src/assets/red_brick_1k/red_brick_diff_1k.jpg',
      () => {},
      undefined,
      (error) => {
        console.log('error load red_brick_diff_1k', error)
      }
    )
    const normalTexture = textureLoader.load(
      '/src/assets/red_brick_1k/red_brick_nor_dx_1k.jpg',
      () => {
        console.log('loaded red_brick_normal_1k')
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
      },
      undefined,
      (error) => {
        console.log('error load red_brick_rough_1k', error)
      }
    )
    setTextureRepeat(colorTexture, state.repeatX, state.repeatY)
    setTextureRepeat(normalTexture, state.repeatX, state.repeatY)
    setTextureRepeat(roughTexture, state.repeatX, state.repeatY)
    // text label
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
    const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    const textLabel1 = createTextLabel('颜色&法线&粗糙贴图')
    mesh.add(textLabel1)
    textLabel1.position.y = 2
    material.map = colorTexture
    material.normalMap = normalTexture
    material.roughnessMap = roughTexture
    // skybox
    const hdrLoader = new HDRLoader(loadingManager)
    hdrLoader.load(
      '/src/assets/skybox/lilienstein_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
      },
      undefined,
      (error) => {
        console.log('error load skybox', error)
      }
    )
    // multi texture
    const colorTexture2 = textureLoader.load(
      '/src/assets/coast_sand_rocks_02_1k/textures/coast_sand_rocks_02_diff_1k.jpg',
      () => {
        console.log('loaded uv_grid_opengl')
      },
      undefined,
      (error) => {
        console.log('error load uv_grid_opengl', error)
      }
    )
    setTextureRepeat(colorTexture2, state.repeatX, state.repeatY)
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: colorTexture },
        uTexture2: { value: colorTexture2 },
        uMixFactor: { value: guiState.texture.uMixFactor },
        uOffset1: { value: new THREE.Vector2(0, 0) },
        uOffset2: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
    const mesh2 = new THREE.Mesh(geometry, shaderMaterial)
    scene.add(mesh2)
    mesh2.position.x = -3
    const textLabel2 = createTextLabel('多纹理，双颜色贴图')
    mesh2.add(textLabel2)
    textLabel2.position.y = 2
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
     * Events
     */
    // resize
    const handleReisze = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleReisze)
    /*
     * Animation
     */
    // const clock = new THREE.Clock()
    // let lastTime = clock.getElapsedTime()
    let animateId: number
    // colorTexture.wrapS = THREE.ClampToEdgeWrapping
    const textureAnimation = () => {
      if (guiState.texture.useU) {
        colorTexture.offset.x += guiState.texture.speedX
        normalTexture.offset.x += guiState.texture.speedX
        roughTexture.offset.x += guiState.texture.speedX
        shaderMaterial.uniforms.uOffset1.value.x = colorTexture.offset.x
        shaderMaterial.uniforms.uOffset2.value.x = colorTexture2.offset.x
      }
      if (guiState.texture.useV) {
        colorTexture.offset.y += guiState.texture.speedY
        normalTexture.offset.y += guiState.texture.speedY
        roughTexture.offset.y += guiState.texture.speedY
        shaderMaterial.uniforms.uOffset1.value.y = colorTexture.offset.y
        shaderMaterial.uniforms.uOffset2.value.y = colorTexture2.offset.y
      }
    }
    const animate = () => {
      animateId = requestAnimationFrame(animate)
      // time
      // const currentTime = clock.getElapsedTime()
      // const deltaTime = currentTime - lastTime
      // algorithm
      textureAnimation()
      // update
      orbitControls.update()
      renderer.render(scene, camera)
      // lastTime = currentTime
    }
    /*
     * GUI
     */
    const gui = new GUI()
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'x').min(-5).max(5).step(0.01)
    cameraFolder.add(camera.position, 'y').min(-5).max(5).step(0.01)
    cameraFolder.add(camera.position, 'z').min(-5).max(5).step(0.01)
    const textureFolder = gui.addFolder('Texture')
    textureFolder.add(guiState.texture, 'useU')
    textureFolder.add(guiState.texture, 'useV')
    textureFolder.add(guiState.texture, 'speedX').min(0.01).max(0.1).step(0.01)
    textureFolder.add(guiState.texture, 'speedY').min(0.01).max(0.1).step(0.01)
    textureFolder
      .add(guiState.texture, 'uMixFactor')
      .min(0.0)
      .max(1)
      .step(0.01)
      .onChange((value) => {
        shaderMaterial.uniforms.uMixFactor.value = value
      })

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
      dispose,
      loader
    }
  }
}
