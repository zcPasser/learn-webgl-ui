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
     * Resize
     */
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      orbitalControls.update()
    }
    window.addEventListener('resize', handleResize)
    /*
     * Cylinder
     */
    const center = cylinder.position.clone()
    const radius = 2
    const speed = 0.005

    const scaleSpeed = 0.005
    const scaleRange = 1
    const scaleCenter = 1.5

    /*
     * Memory Monitor
     */
    let memoryMonitorInterval: number | null = null
    const memoryMonitorElement = document.createElement('div')
    memoryMonitorElement.style.position = 'absolute'
    memoryMonitorElement.style.top = '10px'
    memoryMonitorElement.style.left = '10px'
    memoryMonitorElement.style.padding = '10px'
    memoryMonitorElement.style.background = 'rgba(0, 0, 0, 0.7)'
    memoryMonitorElement.style.color = '#fff'
    memoryMonitorElement.style.borderRadius = '5px'
    memoryMonitorElement.style.fontFamily = 'monospace'
    memoryMonitorElement.style.fontSize = '12px'
    memoryMonitorElement.style.zIndex = '1000'
    container.appendChild(memoryMonitorElement)

    const updateMemoryInfo = () => {
      if (performance && (performance as any).memory) {
        const memory = (performance as any).memory
        const usedJSHeapSize = (memory.usedJSHeapSize / 1048576).toFixed(2)
        const totalJSHeapSize = (memory.totalJSHeapSize / 1048576).toFixed(2)
        const jsHeapSizeLimit = (memory.jsHeapSizeLimit / 1048576).toFixed(2)

        memoryMonitorElement.innerHTML = `
          <div>内存监控:</div>
          <div>已使用: ${usedJSHeapSize} MB</div>
          <div>总分配: ${totalJSHeapSize} MB</div>
          <div>限制: ${jsHeapSizeLimit} MB</div>
          <div>使用率: ${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)}%</div>
        `
      } else {
        memoryMonitorElement.innerHTML =
          '<div>当前浏览器不支持内存监控API</div>'
      }
    }

    // 初始化内存信息
    updateMemoryInfo()

    // 每秒更新一次内存信息
    memoryMonitorInterval = window.setInterval(updateMemoryInfo, 1000)

    /*
     * Animate
     */
    let animationId: number
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime

      cube.rotation.x += 0.02
      const angle = elapsedTime * speed
      cylinder.position.x = center.x
      cylinder.position.z = center.z + radius * Math.sin(angle)
      cylinder.position.y = center.y + radius * Math.cos(angle)
      // cylinder.rotation.z += Math.sin(elapsedTime) + 1
      // cone.rotation.y += Math.sin(elapsedTime) * 0.5
      cone.scale.y =
        scaleCenter + (Math.sin(elapsedTime * scaleSpeed) * scaleRange) / 2

      orbitalControls.update()

      renderer.render(scene, camera)

      animationId = requestAnimationFrame(animate)
    }

    const startTime = Date.now()
    animate(startTime)

    const dispose = () => {
      // 清理几何体
      cubeGeometry.dispose()
      cylinderGeometry.dispose()
      ConeGeometry.dispose()

      // 清理材质
      cubeMaterial.dispose()
      cylinderMaterial.dispose()
      coneMaterial.dispose()

      // 清理控制器
      orbitalControls.dispose()

      // 清理渲染器
      renderer.dispose()

      // 移除事件监听
      window.removeEventListener('resize', handleResize)

      // 取消动画
      cancelAnimationFrame(animationId)

      // 清理内存监控
      if (memoryMonitorInterval) {
        clearInterval(memoryMonitorInterval)
      }
      if (memoryMonitorElement && memoryMonitorElement.parentNode) {
        memoryMonitorElement.parentNode.removeChild(memoryMonitorElement)
      }
    }

    return {
      scene,
      camera,
      renderer,
      animate,
      dispose
    }
  }
} as DemoModule
