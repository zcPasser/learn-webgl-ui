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
    title: '单元练习',
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
      },
      {
        id: '1-3',
        title: '相机控制',
        content: '第一人称相机控制，跟随控制，平滑过渡，漫游控制',
        noteLink:
          'https://www.yuque.com/passer-l28xu/pf100o/egr16asrgk2lyhsu/edit?toc_node_uuid=icuGhVPZMv9eY7wW',
        demoLink: '/demo/1-3'
      },
      {
        id: '1-4',
        title: '纹理应用与动态材质系统',
        content:
          '一个交互式材质展示台，让一个3D物体（比如一个复杂的模型或一组几何体）能够展示多种纹理效果，用户可以通过UI切换不同的纹理模式',
        noteLink:
          'https://www.yuque.com/passer-l28xu/pf100o/bg5pp5x7a46u5ui4/edit?toc_node_uuid=icuGhVPZMv9eY7wW',
        demoLink: '/demo/1-4'
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
