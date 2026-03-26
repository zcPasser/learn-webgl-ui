<template>
  <div class="series-detail">
    <div class="container">
      <el-button @click="goBack" class="back-btn">← 返回首页</el-button>
      <h1 class="title">{{ series?.title }}</h1>
      <p class="description">{{ series?.description }}</p>
      <div class="demo-list">
        <el-card v-for="item in series?.items" :key="item.id" class="demo-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
          <div class="actions">
            <el-button type="primary" @click="openNote(item.noteLink)">
              查看笔记
            </el-button>
            <el-button type="success" @click="goToDemo(item.demoLink)">
              查看演示
            </el-button>
          </div>
        </el-card>
        <el-empty v-if="!series?.items.length" description="暂无 Demo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { seriesList } from '@/config/seriesConfig'

const route = useRoute()
const router = useRouter()

const series = computed(() => {
  const seriesId = route.params.seriesId as string
  return seriesList.find((s) => s.id === seriesId)
})

const goBack = () => {
  router.push('/')
}

const openNote = (link: string) => {
  window.open(link, '_blank')
}

const goToDemo = (link: string) => {
  window.open(link, '_blank')
}
</script>

<style scoped>
.series-detail {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 30px;
}

.title {
  font-size: 36px;
  color: #333;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-card {
  transition: transform 0.2s ease;
}

.demo-card:hover {
  transform: translateX(5px);
}

.demo-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #333;
}

.demo-card p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 15px;
}
</style>
