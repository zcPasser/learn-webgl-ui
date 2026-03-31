import type { Scene, Camera, WebGLRenderer } from 'three'
import { DelHTMLAttributes } from 'vue'

export interface DemoModule {
  title?: string
  setup: (container: HTMLElement) => {
    scene: Scene
    camera: Camera
    renderer: WebGLRenderer
    animate?: (deltaTime: number, currentTime: number) => void
    dispose?: () => void
  }
}

export const demos: Record<string, () => Promise<{ default: DemoModule }>> = {
  '1-1': () => import('./demo-1-1'),
  '1-2': () => import('./demo-1-2')
  // 后续可以继续添加更多 Demo
}
