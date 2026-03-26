<template>
  <div class="demo-view">
    <div class="controls">
      <el-button @click="goBack" size="small">← 返回</el-button>
      <h2>{{ demoTitle }}</h2>
    </div>
    <div ref="canvasContainer" class="canvas-container"></div>
    <div v-if="error" class="error-message">
      <el-alert :title="error" type="error" :closable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SceneManager } from '@/three/core/SceneManager'
import { demos } from '@/three/demos'

const route = useRoute()
const router = useRouter()
const demoId = route.params.demoId as string

const demoTitle = ref('加载中...')
const canvasContainer = ref<HTMLDivElement>()
let sceneManager: SceneManager | null = null
let demoModule: any = null
const error = ref('')

const goBack = () => {
  router.back()
}

const initDemo = async () => {
  if (!canvasContainer.value) return

  try {
    // 动态加载 Demo 模块
    const demoLoader = demos[demoId]
    if (!demoLoader) {
      throw new Error(`Demo ${demoId} 不存在`)
    }

    demoModule = await demoLoader()
    demoTitle.value = demoModule.title || `Demo ${demoId}`

    // 初始化场景管理器
    sceneManager = new SceneManager(canvasContainer.value)
    await sceneManager.init()

    // 设置 Demo
    if (demoModule.setup) {
      demoModule.setup(
        sceneManager.scene,
        sceneManager.camera,
        sceneManager.renderer
      )
    }

    // 启动动画循环
    let lastTime = performance.now()
    const animate = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      if (demoModule.animate) {
        demoModule.animate(deltaTime, currentTime)
      }
      sceneManager?.render()
      requestAnimationFrame(animate)
    }
    animate()
  } catch (err: any) {
    console.error('Demo 加载失败:', err)
    error.value = err.message || 'Demo 加载失败，请检查控制台'
  }
}

onMounted(() => {
  initDemo()
})

onBeforeUnmount(() => {
  if (demoModule?.dispose) {
    demoModule.dispose()
  }
  sceneManager?.dispose()
})
</script>

<style scoped>
.demo-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.controls h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.error-message {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 10;
}
</style>
