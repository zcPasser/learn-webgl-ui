export const createInfoElement = (innerHTML: string) => {
  const info = document.createElement('div')
  info.innerHTML = innerHTML
  info.style.position = 'absolute'
  info.style.top = '10px'
  info.style.left = '10px'
  info.style.padding = '10px'
  info.style.background = 'rgba(113, 106, 106, 0.7)'
  info.style.color = '#fff'
  info.style.borderRadius = '5px'
  info.style.fontFamily = 'monospace'
  info.style.fontSize = '12px'
  info.style.zIndex = '1000'
  return info
}
