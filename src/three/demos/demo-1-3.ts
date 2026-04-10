import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { createInfoElement } from '../utils/infoUtil'
import groundColorMap from '@/assets/sparse_grass/sparse_grass_diff_1k.jpg'
import groundNormalMap from '@/assets/sparse_grass/sparse_grass_nor_gl_1k.jpg'

export default {
  title: '相机控制',
  setup: (container: HTMLCanvasElement) => {
    /*
     * Debug Config
     */
    const debugConfig = {
      usedebugCamera: false,
      useControls: false,
      usePointerLock: false
    }
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
      velocity: new THREE.Vector3(0.5, 0.5, 0.5),
      moveSpeed: 0,
      rotationSpeed: 1,
      maxMoveSpeed: 4.5,
      maxRotationSpeed: 4.5,
      baseMoveSpeed: 1,
      baseRotationSpeed: 1,
      baseMoveDirection: new THREE.Vector3(0, 1, 0),
      viewMode: 'thirdPerson',
      useMouse: false,
      damping: -0.08,
      maxDegree: 150,
      minDegree: -150
    }

    /*
     * Scene + Camera + Renderer
     */
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    /*
     * debugCamera
     */
    let debugCamera: THREE.PerspectiveCamera | undefined
    if (debugConfig.usedebugCamera) {
      debugCamera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      )
      debugCamera.position.set(0, 4, 15)
      scene.add(debugCamera)
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
    let dir = new THREE.Vector3()
    torus.getWorldDirection(dir)
    // cone
    const coneGeometry = new THREE.ConeGeometry(1, 4, 32)
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: 0xad4021,
      roughness: 0.5,
      metalness: 0.1
    })
    const cone = new THREE.Mesh(coneGeometry, coneMaterial)
    /*
     * Camera: Third Person Camera
     */
    // Third Person Camera
    const thirdPersonGroup = new THREE.Group()
    scene.add(thirdPersonGroup)
    thirdPersonGroup.position.set(0, 2, -4)
    thirdPersonGroup.add(cone)
    cone.position.set(0, 0, 0)
    cone.rotation.x = Math.PI / 2
    const thirdPersonCamera = new THREE.PerspectiveCamera(
      80,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    thirdPersonGroup.add(thirdPersonCamera)
    thirdPersonCamera.position.set(0, 5, -8)
    thirdPersonCamera.lookAt(cone.position)
    // First Person Camera
    const firstPersonCamera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    cone.add(firstPersonCamera)
    firstPersonCamera.lookAt(targetState.baseMoveDirection)

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
      <div>左键：点击一次，可查看第三视角周围环境；<br/>再次点击，退出查看模式</div>
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
        debugConfig.usedebugCamera ? debugCamera! : thirdPersonCamera,
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
      thirdPersonCamera.aspect = container.clientWidth / container.clientHeight
      thirdPersonCamera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === 'KeyV') {
        targetState.viewMode =
          targetState.viewMode === 'thirdPerson' ? 'firstPerson' : 'thirdPerson'
      } else keyState[event.code] = true
      if (keyState.KeyS) {
        const reverseQuaternion = new THREE.Quaternion().setFromAxisAngle(
          targetState.baseMoveDirection,
          Math.PI
        )
        cone.applyQuaternion(reverseQuaternion)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    const handleKeyup = (event: KeyboardEvent) => {
      keyState[event.code] = false
    }
    window.addEventListener('keyup', handleKeyup)

    const handleMouseMove = (event: MouseEvent) => {
      if (targetState.useMouse) {
        thirdPersonCamera.rotation.y -= event.movementX / 600
        thirdPersonCamera.rotation.x -= event.movementY / 600
        return
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', () => {
      targetState.useMouse = !targetState.useMouse
    })
    /*
     * Animation
     */
    let animationId: number | undefined = undefined
    let lastTime: number = 0
    const clock = new THREE.Clock()
    let currentMoveDirection = targetState.baseMoveDirection.clone()
    const currentQuaternion = new THREE.Quaternion()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      // console.log('elapsedTime', elapsedTime)
      const deltaTime = elapsedTime - lastTime
      lastTime = elapsedTime

      // if (targetState.velocity.length() < targetState.maxVelocity) {
      if (keyState.KeyA) {
        const angle = targetState.rotationSpeed * deltaTime
        const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
          targetState.baseMoveDirection,
          angle
        )
        cone.applyQuaternion(rotationQuaternion)
      }
      if (keyState.KeyD) {
        const angle = -targetState.rotationSpeed * deltaTime
        const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
          targetState.baseMoveDirection,
          angle
        )
        cone.applyQuaternion(rotationQuaternion)
      }
      if (keyState.KeyW) {
        if (targetState.moveSpeed < targetState.maxMoveSpeed) {
          targetState.moveSpeed += targetState.maxMoveSpeed * deltaTime
        } else {
          targetState.moveSpeed = targetState.maxMoveSpeed
        }
      } else {
        if (targetState.moveSpeed > 0) {
          targetState.moveSpeed = Math.max(
            0,
            targetState.moveSpeed - targetState.maxMoveSpeed * deltaTime
          )
        }
      }
      cone.getWorldQuaternion(currentQuaternion)
      currentMoveDirection = currentMoveDirection
        .copy(targetState.baseMoveDirection)
        .applyQuaternion(currentQuaternion)
        .normalize()
      const velocity = currentMoveDirection.multiplyScalar(
        targetState.moveSpeed
      )
      const deltaPosition = velocity.multiplyScalar(deltaTime)
      thirdPersonGroup.position.add(deltaPosition)
      animationId = requestAnimationFrame(animate)
      controls && controls.update()
      renderer.render(
        scene,
        debugConfig.usedebugCamera
          ? debugCamera!
          : targetState.viewMode === 'thirdPerson'
            ? thirdPersonCamera
            : firstPersonCamera
      )
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
    if (debugConfig.usedebugCamera) {
      cameraHelper = new THREE.CameraHelper(thirdPersonCamera)
      scene.add(cameraHelper)
    }
    /*
     * GUI
     */
    const gui = new GUI()
    const debugFolder = gui.addFolder('Debug')
    debugFolder.add(debugConfig, 'usedebugCamera')
    debugFolder.add(debugConfig, 'useControls').onChange((value) => {
      if (value) {
        createControls()
      } else {
        controls && controls.dispose()
        controls = undefined
      }
    })
    const viewModeFolder = gui.addFolder('Camera')
    viewModeFolder
      .add(targetState, 'viewMode')
      .options({ 第三人称: 'thirdPerson', 第一人称: 'firstPerson' })
    const coneFolder = gui.addFolder('Cone')
    coneFolder
      .add(targetState, 'maxMoveSpeed')
      .name('最大直线移动速度')
      .min(0)
      .max(10)
      .step(0.1)
    coneFolder.add(targetState, 'moveSpeed').name('直线移动速度').listen()
    coneFolder
      .add(targetState, 'rotationSpeed')
      .name('旋转速度')
      .min(0)
      .max(10)
      .step(0.1)
    const cameraFolder = gui.addFolder('第三人称相机')
    cameraFolder.add(thirdPersonCamera.position, 'x').min(-10).max(10).step(0.1)
    cameraFolder.add(thirdPersonCamera.position, 'y').min(-10).max(10).step(0.1)
    cameraFolder.add(thirdPersonCamera.position, 'z').min(-10).max(10).step(0.1)

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
