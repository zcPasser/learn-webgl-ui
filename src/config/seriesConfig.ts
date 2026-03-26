export interface SeriesItem {
  id: string
  title: string
  content: string
  noteLink: string
  demoLink: string
}

export interface Series {
  id: string
  title: string
  description: string
  items: SeriesItem[]
}

export const seriesList: Series[] = [
  {
    id: '1',
    title: 'github项目',
    description: '从零开始学习 Three.js，掌握 3D 图形编程的基本概念和技术',
    items: [
      {
        id: '1-1',
        title: '几何体变换',
        content: '使用自定义 Shader 材质创建渐变效果的旋转立方体',
        noteLink: 'https://www.yuque.com/passer-l28xu/pf100o/rku2e2lvwc7wlkwi',
        demoLink: '/demo/1-1'
      }
    ]
  },
  {
    id: '2',
    title: 'Shader 进阶系列',
    description: '深入 Shader 编程，实现各种视觉效果',
    items: []
  }
]
