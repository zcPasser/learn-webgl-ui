<template>
  <div class="demo-view">
    <!-- <div v-if="isLoading" ref="loadingOverlay" class="loader-container">
      <div class="loader"></div>
      <div class="progress-bar">
        {{ Math.round(demoControls?.progress || 0) }}%
      </div>
    </div> -->
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
console.log('demoId', demoId)
const demoTitle = ref('加载中...')
const canvasContainer = ref<HTMLDivElement>()
const loadingOverlay = ref<HTMLDivElement>()
const isLoading = ref(true)
let sceneManager: SceneManager | null = null
let demoModule: any = null
let demoControls: any = ref<any>(null)
const error = ref('')

const updateProgressBar = (progress: number) => {
  demoControls.value && (demoControls.value.progress = progress)
  console.log('progress', progress)
}

const initDemo = async () => {
  if (!canvasContainer.value) return

  try {
    // 动态加载 Demo 模块
    const demoLoader = demos[demoId]
    if (!demoLoader) {
      throw new Error(`Demo ${demoId} 不存在`)
    }

    demoModule = await demoLoader().then((module) => module.default)
    demoTitle.value = demoModule.title || `Demo ${demoId}`

    demoControls.value = await demoModule.setup(
      canvasContainer.value,
      loadingOverlay.value,
      updateProgressBar
    )

    if (demoControls?.animate) {
      demoControls.animate()
    }
  } catch (err: any) {
    console.error('Demo 加载失败:', err)
    error.value = err.message || 'Demo 加载失败，请检查控制台'
  }
}

onMounted(() => {
  initDemo()
})

onBeforeUnmount(() => {
  if (demoControls?.dispose) {
    demoControls.dispose()
  }
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

.loader-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  z-index: 1024;
  background: rgba(0, 0, 0, 0.85);
}
.progress-bar {
  color: white;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}
/* HTML: <div class="loader"></div> */
.loader {
  --c1: #673b14;
  --c2: #f8b13b;
  width: 40px;
  height: 80px;
  border-top: 4px solid var(--c1);
  border-bottom: 4px solid var(--c1);
  background: linear-gradient(
      90deg,
      var(--c1) 2px,
      var(--c2) 0 5px,
      var(--c1) 0
    )
    50%/7px 8px no-repeat;
  display: grid;
  overflow: hidden;
  animation: l5-0 2s infinite linear;
}
.loader::before,
.loader::after {
  content: '';
  grid-area: 1/1;
  width: 75%;
  height: calc(50% - 4px);
  margin: 0 auto;
  border: 2px solid var(--c1);
  border-top: 0;
  box-sizing: content-box;
  border-radius: 0 0 40% 40%;
  -webkit-mask:
    linear-gradient(#000 0 0) bottom/4px 2px no-repeat,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  background:
    linear-gradient(var(--d, 0deg), var(--c2) 50%, #0000 0) bottom / 100% 205%,
    linear-gradient(var(--c2) 0 0) center/0 100%;
  background-repeat: no-repeat;
  animation: inherit;
  animation-name: l5-1;
}
.loader::after {
  transform-origin: 50% calc(100% + 2px);
  transform: scaleY(-1);
  --s: 3px;
  --d: 180deg;
}
@keyframes l5-0 {
  80% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(0.5turn);
  }
}
@keyframes l5-1 {
  10%,
  70% {
    background-size:
      100% 205%,
      var(--s, 0) 100%;
  }
  70%,
  100% {
    background-position: top, center;
  }
}
</style>
