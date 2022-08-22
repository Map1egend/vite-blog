import Brush from '@utils/brush'
import Point from '@utils/point'

export default function useBrush(brush: Brush) {
  let beginPoint: Point | null
  let mousePoints: Point[] = []
  const path: Path2D = new Path2D()

  // 自由线
  const freeLineDown: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.addEventListener('mousemove', freeLineMove)
    beginPoint = new Point(e.offsetX, e.offsetY)
    mousePoints.push(beginPoint)
    brush.beginPath()
  }
  const freeLineMove: (e: Event) => void = (e: Event) => {
    if (e instanceof MouseEvent) {
      mousePoints.push(new Point(e.offsetX, e.offsetY))
      if (mousePoints.length > 2) {
        const lastTwoPoints = mousePoints.slice(-2)
        const controlPoint = lastTwoPoints[0]
        const endPoint = Point.midPoint(lastTwoPoints[0], lastTwoPoints[1])
        brush?.freeLine(beginPoint as Point, controlPoint, endPoint)
        beginPoint = endPoint
      }
    }
  }
  const freeLineUp: (e: MouseEvent) => void = (e: MouseEvent) => {
    mousePoints.push(new Point(e.offsetX, e.offsetY))
    if (mousePoints.length > 2) {
      const lastTwoPoints = mousePoints.slice(-2)
      const controlPoint = lastTwoPoints[0]
      const endPoint = Point.midPoint(lastTwoPoints[0], lastTwoPoints[1])
      brush?.freeLine(beginPoint as Point, controlPoint, endPoint)
    }
    beginPoint = null
    mousePoints = []
    e.target?.removeEventListener('mousemove', freeLineMove)
    brush.closePath()
  }
  // 直线
  const straightLineDown: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.addEventListener('mousemove', straightLineMove)
    beginPoint = new Point(e.offsetX, e.offsetY)
  }
  const straightLineMove: (e: Event) => void = (e: Event) => {
    if (e instanceof MouseEvent) {
      brush.straightLine(beginPoint as Point, new Point(e.offsetX, e.offsetY))
    }
  }
  const straightLineUp: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.removeEventListener('mousemove', straightLineMove)
    brush.beginPath()
    brush.straightLine(beginPoint as Point, new Point(e.offsetX, e.offsetY))
    brush.closePath()
  }
  // 圆
  const circleDown: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.addEventListener('mousemove', circleMove)
    beginPoint = new Point(e.offsetX, e.offsetY)
  }
  const circleMove: (e: Event) => void = (e: Event) => {
    if (e instanceof MouseEvent) {
      brush.circle(beginPoint as Point, new Point(e.offsetX, e.offsetY))
    }
  }
  const circleUp: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.removeEventListener('mousemove', circleMove)
    brush.beginPath()
    brush.circle(beginPoint as Point, new Point(e.offsetX, e.offsetY))
    brush.closePath()
  }
  // 矩形
  const rectDown: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.addEventListener('mousemove', rectMove)
    beginPoint = new Point(e.offsetX, e.offsetY)
  }
  const rectMove: (e: Event) => void = (e: Event) => {
    if (e instanceof MouseEvent) {
      brush.rect(beginPoint as Point, new Point(e.offsetX, e.offsetY))
    }
  }
  const rectUp: (e: MouseEvent) => void = (e: MouseEvent) => {
    e.target?.removeEventListener('mousemove', rectMove)
    brush.beginPath()
    brush.rect(beginPoint as Point, new Point(e.offsetX, e.offsetY))
    brush.closePath()
  }
  // 填充颜色
  const fill: (e: DragEvent) => void = (e: DragEvent) => {
    console.log('填充')
  }

  return {
    mousePoints,
    path,
    freeLineDown,
    freeLineUp,
    straightLineDown,
    straightLineUp,
    circleDown,
    circleUp,
    rectDown,
    rectUp,
    fill
  }
}
