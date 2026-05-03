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
          '多种光源，多种材质，光源位置动态变化，实现阴影效果，文本标签，添加 GUI 控制光照参数',
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
          '加载进度管理，纹理动画，天空盒，纹理混合，shader，文本标签，GUI操控',
        noteLink:
          'https://www.yuque.com/passer-l28xu/pf100o/bg5pp5x7a46u5ui4/edit?toc_node_uuid=icuGhVPZMv9eY7wW',
        demoLink: '/demo/1-4'
      },
      {
        id: '1-5',
        title: '模型加载与动画系统',
        content:
          '加载 GLTF 模型，播放模型动画，实现模型的交互（点击、悬停），添加模型的后处理效果',
        noteLink:
          'https://www.yuque.com/passer-l28xu/pf100o/hh261g1l62vtbkzd/edit?toc_node_uuid=icuGhVPZMv9eY7wW',
        demoLink: '/demo/1-5'
      },
      {
        id: '1-6',
        title: '物理模拟',
        content: '重力模拟，碰撞检测，弹性效果，约束系统',
        noteLink: 'https://www.yuque.com/passer-l28xu/pf100o/pc3zggvw0z0z2q6g',
        demoLink: '/demo/1-6'
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
