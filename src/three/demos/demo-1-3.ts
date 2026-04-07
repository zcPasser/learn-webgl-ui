import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { createInfoElement } from '../utils/infoUtil'
import groundColorMap from '@/assets/sparse_grass/sparse_grass_diff_1k.jpg'
import groundNormalMap from '@/assets/sparse_grass/sparse_grass_nor_gl_1k.jpg'
import { velocity } from 'three/tsl'

export default {
  title: '相机控制',
  setup: (container: HTMLCanvasElement) => {
    /*
     * Debug Config
     */
    const debugConfig = {
      useCamera2: false,
      useControls: false
    }
    /*
     * GUI Config
     */
    const guiConfig = {}
    /*
     * State
     */
    // key state
    const keyState: Record<string, boolean> = {
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false
    }
    // Target State
    const targetState = {
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: 12,
      maxVelocity: 5,
      damping: -0.08,
      maxDegree: 150,
      minDegree: -150
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
    // scene.add(camera)
    // camera.position.set(0, 10, 15)
    // camera.lookAt(0, 0, 0)
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
      camera2.position.set(0, 4, 15)
      scene.add(camera2)
    }
    /*
     * Mesh
     */
    // ground
    const loader = new THREE.TextureLoader()
    const colorMap = loader.load(
      groundColorMap,
      (texture) => {
        console.log('colorMap load success')
      },
      undefined,
      (err) => {
        console.log('colorMap load error', err)
      }
    )
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMap.repeat.set(10, 10)
    console.log(colorMap)
    const normalMap = loader.load(
      groundNormalMap,
      (texture) => {
        console.log('normalMap load success')
      },
      undefined,
      (err) => {
        console.log('normalMap load error', err)
      }
    )
    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(10, 10)
    console.log(normalMap)
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      side: THREE.DoubleSide
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    scene.add(ground)
    ground.rotation.x = -Math.PI / 2
    // sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x3b556f })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)
    sphere.position.set(6, 2, 0)
    // cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x9ba22c })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)
    scene.add(cube)
    cube.position.set(-6, 2, 0)
    // torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.5, 32, 32)
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x9ba22c })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    scene.add(torus)
    torus.position.set(0, 2, 10)
    // cone
    const targetGroup = new THREE.Group()
    scene.add(targetGroup)
    const coneGeometry = new THREE.ConeGeometry(1, 4, 32)
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: 0xad4021,
      roughness: 0.5,
      metalness: 0.1
    })
    const cone = new THREE.Mesh(coneGeometry, coneMaterial)
    targetGroup.add(cone)
    targetGroup.position.set(0, 2, -10)
    cone.position.set(0, 0, 0)
    cone.rotation.x = Math.PI / 2
    // cone.rotation.y = -Math.PI / 2
    targetGroup.add(camera)
    camera.position.set(0, 4, -5)
    camera.lookAt(0, 2, -10)
    /*
     * Info
     */
    const infoInnerHTML = `
      <div>信息提示</div>
      <div>W: 前进</div>
      <div>S: 后退</div>
      <div>A: 左转</div>
      <div>D: 右转</div>
      <div>V: 切换视角模式(第一/第三)</div>
      <div>鼠标点击锁定视角</div>
      <div>ESC: 退出指针锁定</div>
    `
    const infoElement = createInfoElement(infoInnerHTML)
    container.appendChild(infoElement)
    /*
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    scene.add(directionalLight)
    directionalLight.position.set(5, 10, 5)
    /*
     * Controls
     */
    let controls: OrbitControls | undefined = undefined
    const createControls = () => {
      controls = new OrbitControls(
        debugConfig.useCamera2 ? camera2! : camera,
        renderer.domElement
      )
      controls.enableDamping = true
    }
    if (debugConfig.useControls) {
      createControls()
    }
    /*
     * Event
     */
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    let useFirstView = true
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === 'KeyV') {
        if (useFirstView) {
          camera.position.z = 5
        } else {
          camera.position.z = -5
        }
        useFirstView = !useFirstView
      } else keyState[event.code] = true
      // console.log('keyState', keyState)
    }
    window.addEventListener('keydown', handleKeydown)
    const handleKeyup = (event: KeyboardEvent) => {
      keyState[event.code] = false
      // console.log('keyState', keyState)
    }
    window.addEventListener('keyup', handleKeyup)
    const pointerLockControls = new PointerLockControls(
      camera,
      renderer.domElement
    )
    pointerLockControls.addEventListener('lock', () => {
      console.log('pointerLockControls lock')
      infoElement.style.display = 'none'
    })
    pointerLockControls.addEventListener('unlock', () => {
      console.log('pointerLockControls unlock')
      infoElement.style.display = 'block'
    })
    let useRotation = false
    // const maxAngle = THREE.MathUtils.degToRad(targetState.maxDegree)
    // const minAngle = THREE.MathUtils.degToRad(targetState.minDegree)
    const maxAngle = -2.3218517113662562
    const minAngle = -maxAngle
    const handleMouseMove = (event: MouseEvent) => {
      // if (pointerLockControls.isLocked) {
      if (useRotation) {
        event.preventDefault()
        targetGroup.rotation.y -= event.movementX / 600
        camera.rotation.x -= event.movementY / 600
        console.log('camera.rotation.x', camera.rotation.x, minAngle, maxAngle)
        // if (camera.rotation.x < minAngle) {
        //   camera.rotation.x = minAngle
        //   console.log('camera.rotation.x < minAngle')
        // }
        // if (camera.rotation.x > maxAngle) {
        //   camera.rotation.x = maxAngle
        //   console.log('camera.rotation.x > maxAngle')
        // }
      }
      // }
    }
    window.addEventListener('mousedown', () => {
      useRotation = true
    })
    window.addEventListener('mouseup', () => {
      useRotation = false
    })
    window.addEventListener('mousemove', handleMouseMove)
    /*
     * Animation
     */
    let animationId: number | undefined = undefined
    let lastTime: number = 0
    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      // console.log('elapsedTime', elapsedTime)
      const deltaTime = elapsedTime - lastTime
      lastTime = elapsedTime

      if (targetState.velocity.length() < targetState.maxVelocity) {
        if (keyState.KeyW) {
          const front = new THREE.Vector3()
          targetGroup.getWorldDirection(front)
          targetState.velocity.add(
            front.multiplyScalar(targetState.acceleration * deltaTime)
          )
        }
        if (keyState.KeyS) {
          const front = new THREE.Vector3()
          targetGroup.getWorldDirection(front)
          targetState.velocity.add(
            front.multiplyScalar(-targetState.acceleration * deltaTime)
          )
        }
        if (keyState.KeyA) {
          const front = new THREE.Vector3()
          targetGroup.getWorldDirection(front)
          const up = new THREE.Vector3(0, 1, 0)
          const left = up.clone().cross(front)
          targetState.velocity.add(
            left.multiplyScalar(targetState.acceleration * deltaTime)
          )
          targetGroup.rotation.y += 1.5 * deltaTime
        }
        if (keyState.KeyD) {
          const front = new THREE.Vector3()
          targetGroup.getWorldDirection(front)
          const up = new THREE.Vector3(0, 1, 0)
          const right = front.clone().cross(up)
          targetState.velocity.add(
            right.multiplyScalar(targetState.acceleration * deltaTime)
          )
          targetGroup.rotation.y -= 1.5 * deltaTime
        }
        // cone.quaternion.copy(camera.quaternion)
      }
      // 阻尼
      targetState.velocity.addScaledVector(
        targetState.velocity,
        targetState.damping
      )
      // update the position of cone
      const deltaPosition = targetState.velocity
        .clone()
        .multiplyScalar(deltaTime)
      targetGroup.position.add(deltaPosition)

      animationId = requestAnimationFrame(animate)
      controls && controls.update()
      renderer.render(scene, debugConfig.useCamera2 ? camera2! : camera)
    }
    /*
     * Helper
     */
    // AxesHelper
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    // GridHelper
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)
    gridHelper.position.set(0, 0.2, 0)
    // CameraHelper
    let cameraHelper: THREE.CameraHelper | undefined
    if (debugConfig.useCamera2) {
      cameraHelper = new THREE.CameraHelper(camera)
      scene.add(cameraHelper)
    }
    /*
     * GUI
     */
    const gui = new GUI()
    const debugFolder = gui.addFolder('Debug')
    debugFolder.add(debugConfig, 'useCamera2')
    debugFolder.add(debugConfig, 'useControls').onChange((value) => {
      if (value) {
        createControls()
      } else {
        controls && controls.dispose()
        controls = undefined
      }
    })
    const coneFolder = gui.addFolder('Cone')
    coneFolder
      .add(targetState.velocity, 'z')
      .name('速度Z')
      .min(0)
      .max(10)
      .step(0.1)
      .onChange(() => {
        console.log('targetState.velocity', targetState.velocity)
      })
    coneFolder.add(cone.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.1)
    coneFolder.add(cone.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.1)
    coneFolder.add(cone.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.1)
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'x').min(-10).max(10).step(0.1)
    cameraFolder.add(camera.position, 'y').min(-10).max(10).step(0.1)
    cameraFolder.add(camera.position, 'z').min(-10).max(10).step(0.1)
    /*
     * Dispose
     */
    const dispose = () => {
      controls && controls.dispose()
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
