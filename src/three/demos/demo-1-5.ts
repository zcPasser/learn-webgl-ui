import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import vertexShader from '@/shaders/demos/demo-1-4/vertex.glsl'
import fragmentShader from '@/shaders/demos/demo-1-4/fragment.glsl'
import { createPlainText } from '@/three/utils/textUtil'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { fadeToAction } from '../utils/animationUtil'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

export default {
  title: '模型加载与动画系统',
  setup: async (container: HTMLElement) => {
    /*
     * State
     */
    // GUI State
    const guiState = {
      fadeDuration: 0.5,
      timeScale: 1,
      highLight: 'Whole' as 'Whole' | 'Local',
      usePostProcessing: false
    }
    // Scene State
    const sceneState = {
      modelState: {
        model: null as THREE.Object3D | null,
        actions: {} as Record<string, THREE.AnimationAction>,
        previousStateAction: null as THREE.AnimationAction | null,
        currentStateAction: null as THREE.AnimationAction | null,
        currentState: 'Walking',
        currentEmote: '',
        states: [
          'Idle',
          'Walking',
          'Running',
          'Dance',
          'Death',
          'Sitting',
          'Standing'
        ],
        emotes: ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'],
        animationPause: false
      },
      instance: {
        animationMixer: null as THREE.AnimationMixer | null
      },
      pointer: {
        x: 0,
        y: 0
      },
      hovered: false,
      hoveredMesh: null as THREE.Mesh | null
    }

    /*
     * Init: Scene & Camera & Renderer
     */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(2, 1, 5)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    /*
     * Control
     */
    const controls = new OrbitControls(camera, renderer.domElement)
    /*
     * Load Model
     */
    const gltfLoader = new GLTFLoader()
    const gltf = await gltfLoader.loadAsync(
      '/src/assets/models/RobotExpressive.glb'
    )
    sceneState.modelState.model = gltf.scene
    sceneState.modelState.model.scale.set(0.5, 0.5, 0.5)
    scene.add(sceneState.modelState.model)
    if (!sceneState.instance.animationMixer) {
      sceneState.instance.animationMixer = new THREE.AnimationMixer(
        sceneState.modelState.model
      )
    }
    for (let i = 0; i < gltf.animations.length; i++) {
      const clip = gltf.animations[i]
      const action = sceneState.instance.animationMixer.clipAction(clip)
      sceneState.modelState.actions[clip.name] = action
      if (
        sceneState.modelState.emotes.indexOf(clip.name) >= 0 ||
        sceneState.modelState.states.indexOf(clip.name) >= 4
      ) {
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
      console.log('name', clip.name, 'duration', clip.duration)
    }
    sceneState.modelState.currentStateAction =
      sceneState.modelState.actions[sceneState.modelState.currentState]
    sceneState.modelState.currentStateAction.play()
    sceneState.modelState.previousStateAction =
      sceneState.modelState.currentStateAction
    console.log('sceneState.modelState.actions', sceneState.modelState.actions)

    /*
     * Light
     */
    // AmbientLight
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    // DirectionalLight
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    /*
     * Event
     */
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    const raycaster = new THREE.Raycaster()
    const useWholeHighlight = () => {
      console.log('useWholeHighlight')
      const highLight = () => {
        sceneState.modelState.model?.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.set(0x908989)
              child.material.emissiveIntensity = 1
            }
            console.log(
              'child',
              child.name,
              child.material.emissive.getHexString()
            )
          }
        })
      }
      const unHighLight = () => {
        sceneState.modelState.model?.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.set(0x000000)
            }
          }
        })
      }
      return {
        highLight,
        unHighLight
      }
    }
    const useLocalHighlight = (target: THREE.Object3D | null) => {
      console.log('useLocalHighlight')
      const highLight = () => {
        console.log('highLight')
        sceneState.modelState.model?.traverse((child) => {
          if (child instanceof THREE.Mesh && child === target) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissive.set(0x908989)
              child.material.emissiveIntensity = 1
            }
            sceneState.hoveredMesh = child
          }
        })
      }
      const unHighLight = () => {
        console.log('unHighLight')
        if (sceneState.hoveredMesh) {
          if (
            sceneState.hoveredMesh.material instanceof
            THREE.MeshStandardMaterial
          ) {
            sceneState.hoveredMesh.material.emissive.set(0x000000)
          }
          sceneState.hoveredMesh = null
        }
      }
      return {
        highLight,
        unHighLight
      }
    }
    renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => {
      // console.log('mousemove', event.clientX, event.clientY)
      // NDC
      const x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
      const y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
      // console.log('NDC', x, y)
      sceneState.pointer.x = x
      sceneState.pointer.y = y
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      const intersects = raycaster.intersectObjects(
        [sceneState.modelState.model!],
        true
      )
      const isHit = intersects.length > 0
      // console.log('intersects', intersects)
      if (sceneState.hovered) {
        if (!isHit) {
          console.log('leave')
          guiState.highLight === 'Whole'
            ? useWholeHighlight().unHighLight()
            : useLocalHighlight(null).unHighLight()
        } else {
          // console.log('keep in')
        }
      } else {
        if (isHit) {
          console.log('enter')
          console.log('intersects[0].object', intersects[0].object)
          guiState.highLight === 'Whole'
            ? useWholeHighlight().highLight()
            : useLocalHighlight(intersects[0].object).highLight()
        } else {
          // console.log('keep out')
        }
      }
      sceneState.hovered = isHit
    })
    /*
     * Post-processing
     */
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const outlinePass = new OutlinePass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      scene,
      camera,
      [sceneState.modelState.model!]
    )
    composer.addPass(outlinePass)
    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(container.clientWidth, container.clientHeight),
    //   0.5,
    //   0.5,
    //   0.5
    // )
    // composer.addPass(bloomPass)
    /*
     * Helper
     */
    // AxesHelper
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    /*
     * GUI
     */
    const gui = new GUI()
    const animationFolder = gui.addFolder('Animation')
    // State control
    animationFolder
      .add(sceneState.modelState, 'currentState')
      .name('States')
      .options(sceneState.modelState.states)
      .onChange((state: any) => {
        console.log('state', state, sceneState.modelState.currentState)
        const previousStateAction = sceneState.modelState.previousStateAction
        const activeStateAction = sceneState.modelState.actions[state]
        fadeToAction(
          previousStateAction,
          activeStateAction,
          guiState.fadeDuration
        )
        sceneState.modelState.previousStateAction = activeStateAction
      })
    const emoteFolder = gui.addFolder('Emotes')
    const restoreState = () => {
      console.log('restoreState')
      if (!sceneState.modelState.currentEmote) return
      const previousEmoteAction =
        sceneState.modelState.actions[sceneState.modelState.currentEmote]
      const activeStateAction = sceneState.modelState.previousStateAction
      fadeToAction(
        previousEmoteAction,
        activeStateAction,
        guiState.fadeDuration
      )
      sceneState.instance.animationMixer?.removeEventListener(
        'finished',
        restoreState
      )
    }
    const api: Record<string, () => void> = {}
    const createEmoteCallback = (emote: string) => {
      api[emote] = () => {
        console.log('trigger emote', emote)
        const previousStateAction = sceneState.modelState.previousStateAction
        const activeEmoteAction = sceneState.modelState.actions[emote]
        fadeToAction(
          previousStateAction,
          activeEmoteAction,
          emote === 'Punch' ? 0.1 : guiState.fadeDuration
        )
        console.log(
          'activeEmoteAction',
          activeEmoteAction?.getClip().name,
          activeEmoteAction?.getEffectiveWeight()
        )
        console.log(
          'previousStateAction',
          previousStateAction?.getClip().name,
          previousStateAction?.getEffectiveWeight()
        )
        sceneState.modelState.currentEmote = emote
        sceneState.instance.animationMixer?.addEventListener(
          'finished',
          restoreState
        )
      }
    }
    sceneState.modelState.emotes.forEach((emote) => {
      createEmoteCallback(emote)
      emoteFolder.add(api, emote)
    })
    const animationControlApi: Record<string, () => void> = {
      pause: () => {
        sceneState.modelState.animationPause = true
        sceneState.modelState.actions[
          sceneState.modelState.currentState
        ].paused = true
      },
      resume: () => {
        sceneState.modelState.animationPause = false
        sceneState.modelState.actions[
          sceneState.modelState.currentState
        ].paused = false
      },
      reset: () => {
        const activeStateAction =
          sceneState.modelState.actions[sceneState.modelState.currentState]
        fadeToAction(null, activeStateAction, guiState.fadeDuration)
      }
    }
    const animationControlFolder = gui.addFolder('Animation Control')
    animationControlFolder.add(animationControlApi, 'pause')
    animationControlFolder.add(animationControlApi, 'resume')
    animationControlFolder.add(animationControlApi, 'reset')
    // Fade duration control
    animationControlFolder
      .add(guiState, 'fadeDuration', 0, 2, 0.01)
      .name('Fade Duration (s)')
    animationControlFolder
      .add(guiState, 'timeScale', 0, 2, 0.01)
      .onChange((value: number) => {
        sceneState.modelState.actions[
          sceneState.modelState.currentState
        ].timeScale = value
      })
    // raycast highlight
    const highlightFolder = gui.addFolder('RayCast Highlight')
    highlightFolder
      .add(guiState, 'highLight')
      .options({ Whole: 'Whole', Local: 'Local' })
    // post-processing
    const postProcessingFolder = gui.addFolder('Post Processing')
    postProcessingFolder.add(guiState, 'usePostProcessing')
    /*
     * Animation
     */
    const clock = new THREE.Clock()
    let lastTime = clock.getElapsedTime()
    const animate = () => {
      requestAnimationFrame(animate)
      // time
      const time = clock.getElapsedTime()
      const deltaTime = time - lastTime
      lastTime = time
      // algorithm
      // update
      if (sceneState.instance.animationMixer) {
        sceneState.instance.animationMixer.update(deltaTime)
      }
      controls.update()
      if (guiState.usePostProcessing) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
    }

    console.log('scene', scene)
    /*
     * Dispose
     */
    const dispose = () => {
      controls.dispose()
      renderer.dispose()
      // 动画资源清理
      if (sceneState.instance.animationMixer) {
        sceneState.instance.animationMixer.stopAllAction()
      }
      if (sceneState.modelState.actions[sceneState.modelState.currentEmote]) {
        sceneState.modelState.actions[sceneState.modelState.currentEmote].stop()
        sceneState.modelState.currentEmote = ''
      }
      if (sceneState.modelState.previousStateAction) {
        sceneState.modelState.previousStateAction.stop()
        sceneState.modelState.previousStateAction = null
      }
      if (composer) {
        composer.dispose()
      }
    }

    return {
      animate,
      dispose
    }
  }
}
