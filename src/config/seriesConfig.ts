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
        content:
          '多种几何体，具备不同颜色，实现旋转、缩放、位移动画，添加键盘控制来改变材质线框参数',
        noteLink: 'https://www.yuque.com/passer-l28xu/pf100o/rku2e2lvwc7wlkwi',
        demoLink: '/demo/1-1'
      },
      {
        id: '1-2',
        title: '光照实验',
        content:
          '多种光源，多种材质，光源位置动态变化，实现阴影效果，添加 GUI 控制光照参数',
        noteLink:
          'https://www.yuque.com/passer-l28xu/pf100o/kno0aksw7rxig6z8/edit?toc_node_uuid=icuGhVPZMv9eY7wW',
        demoLink: '/demo/1-2'
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
