/**
 * 文本渲染缩放比例
 */
// 分辨率缩放比例
const RESOLUTION_SCALE = 4
// 画布缩放比例
const CANVAS_SCALE = 1.5

/**
 * 文本换行
 * @param text 文本内容
 * @param wrapWidth 换行宽度
 * @param ctx 2D 上下文
 * @returns 换行后的文本数组
 */
export const handleTextWrap = (
  text: string,
  wrapWidth: number = 256,
  ctx: CanvasRenderingContext2D
): string[] => {
  if (!text) return []
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  // 中文/无空格长文本
  if (words.length === 1) {
    const chars = text.split('')
    currentLine = chars[0] || ''

    for (let i = 1; i < chars.length; i++) {
      const testLine = currentLine + chars[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > wrapWidth) {
        lines.push(currentLine)
        currentLine = chars[i]
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }
    return lines
  }
  // 英文/有空格长文本
  currentLine = words[0] || ''
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i]
    const metrics = ctx.measureText(testLine)
    if (metrics.width > wrapWidth) {
      lines.push(currentLine)
      currentLine = words[i]
    } else {
      currentLine = testLine
    }
    if (currentLine) {
      lines.push(currentLine)
    }
  }
  return lines
}
/**
 * 创建 纯文本内容 画布
 * @param text 文本内容
 * @param fontSize 字体大小
 * @param color 字体颜色
 * @returns 文本画布
 */
export const createPlainText = (
  text: string = 'Hello, Three.js!',
  fontSize: number = 16,
  color: string = '#ffffff'
) => {
  // 临时画布，用于测量文本宽度
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D
  const fontSizeScale = fontSize * RESOLUTION_SCALE
  tempCtx.font = `${fontSizeScale}px Arial`
  // 文本换行
  const paddingX = 20 * RESOLUTION_SCALE * CANVAS_SCALE
  const paddingY = 10 * RESOLUTION_SCALE * CANVAS_SCALE
  const maxWidth = 256 * RESOLUTION_SCALE * CANVAS_SCALE
  const lines = handleTextWrap(text, maxWidth, tempCtx)
  // 计算单行文本最大宽度
  let textWidth = 0
  for (const line of lines) {
    const metrics = tempCtx.measureText(line)
    if (metrics.width > textWidth) {
      textWidth = metrics.width
    }
  }
  // 计算画布尺寸
  const lineHeight = fontSizeScale * 1.2
  const canvasWidth = textWidth + paddingX * 2
  const canvasHeight = lines.length * lineHeight + paddingY * 2
  // 创建画布
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  // 透明背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0)'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  // 渲染文本
  ctx.font = `${fontSizeScale}px Arial`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // 文本居中
  const textCenterX = canvasWidth / 2
  const startY = paddingY + lineHeight / 2

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight
    ctx.fillText(line, textCenterX, y)
  })
  return canvas
}
