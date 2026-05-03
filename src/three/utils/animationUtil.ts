import * as THREE from 'three'

export const fadeToAction = (
  previousAction: THREE.AnimationAction | null,
  activeAction: THREE.AnimationAction | null,
  fadeDuration: number,
  timeScale: number = 1
) => {
  if (!activeAction) return
  if (previousAction === activeAction) return
  if (previousAction) {
    previousAction.fadeOut(fadeDuration)
  }
  activeAction
    .reset()
    .setEffectiveTimeScale(timeScale)
    .setEffectiveWeight(1)
    .fadeIn(fadeDuration)
    .play()
}
