import * as THREE from 'three'

export class SceneManager {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
  }

  async init(): Promise<void> {
    // 设置渲染器
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    )
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)

    // 设置相机位置
    this.camera.position.set(0, 2, 5)
    this.camera.lookAt(0, 0, 0)

    // 添加基础光照
    const ambientLight = new THREE.AmbientLight(0x404040)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 2, 1)
    this.scene.add(directionalLight)

    // 添加辅助网格
    const gridHelper = new THREE.GridHelper(10, 20, 0x888888, 0x444444)
    this.scene.add(gridHelper)

    // 添加坐标轴辅助（可选）
    // const axesHelper = new THREE.AxesHelper(5)
    // this.scene.add(axesHelper)

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  private handleResize(): void {
    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleResize.bind(this))
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }
}
