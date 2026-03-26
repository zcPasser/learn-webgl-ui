import type { Scene, Camera, WebGLRenderer } from 'three'

export interface DemoModule {
  title?: string
  setup: (scene: Scene, camera: Camera, renderer: WebGLRenderer) => void
  animate?: (deltaTime: number, currentTime: number) => void
  dispose?: () => void
}

export const demos: Record<string, () => Promise<{ default: DemoModule }>> = {
  '1-1': () => import('./demo-1-1')
  // 后续可以继续添加更多 Demo
}
