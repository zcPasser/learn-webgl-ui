import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SeriesDetail from '@/views/SeriesDetail.vue'
import DemoView from '@/views/DemoView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/series/:seriesId',
      name: 'SeriesDetail',
      component: SeriesDetail
    },
    {
      path: '/demo/:demoId',
      name: 'DemoView',
      component: DemoView
    }
  ]
})

export default router
