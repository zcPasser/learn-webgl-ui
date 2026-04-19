import type { Scene, Camera, WebGLRenderer } from 'three'

export interface DemoModule {
  title?: string
  setup: (
    container: HTMLElement,
    loadingOverlay?: HTMLElement
  ) => {
    scene: Scene
    camera: Camera
    renderer: WebGLRenderer
    useLoading?: boolean
    animate?: (deltaTime: number, currentTime: number) => void
    dispose?: () => void
    loader?: HTMLElement | null
  }
}
// 自动导入所有 Demo 模块
const demoModules = import.meta.glob<{ default: DemoModule }>('./demo-*.ts')

console.log('demoModules', demoModules)

export const demos: Record<string, () => Promise<{ default: DemoModule }>> =
  Object.fromEntries(
    Object.entries(demoModules)
      .filter(([path]) => path.match(/demo-\d+-\d+\.ts$/))
      .map(([path, loader]) => {
        const demoId = path.match(/demo-(\d+-\d+)\.ts/)?.[1] || ''
        return [demoId, loader]
      })
  )
