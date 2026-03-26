<template>
  <div class="home">
    <div class="container">
      <h1 class="title">WebGL 学习记录</h1>
      <p class="subtitle">记录 Three.js 与 Shader 等技术栈 编程的学习历程</p>
      <div class="series-grid">
        <el-card
          v-for="series in seriesList"
          :key="series.id"
          class="series-card"
          @click="goToSeries(series.id)"
        >
          <h3>{{ series.title }}</h3>
          <p>{{ series.description }}</p>
          <div class="demo-count">{{ series.items.length }} 个 Demo</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { seriesList } from '@/config/seriesConfig'

const router = useRouter()

const goToSeries = (seriesId: string) => {
  router.push(`/series/${seriesId}`)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: white;
  font-size: 48px;
  margin-bottom: 16px;
}

.subtitle {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin-bottom: 60px;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.series-card {
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background: white;
  border-radius: 12px;
}

.series-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.series-card h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

.series-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.demo-count {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
}
</style>
