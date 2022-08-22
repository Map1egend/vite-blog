import History from '@utils/history'
import Point from '../point'

interface path {
  path: Path2D
  color: strokeColor
  width: number
  lineJoin: CanvasLineJoin
  lineCap: CanvasLineCap
  type?: string
}

class Brush {
  // 私有属性
  private ctx: CanvasRenderingContext2D
  private brush: Path2D | null
  private supBrush: Path2D | CanvasRenderingContext2D | null
  private history: History<path>
  private width: number
  private height: number
  private color: strokeColor
  // 公有属性

  constructor(ctx: CanvasRenderingContext2D, color = '#fff', lineWidth = 1, lineJoin: CanvasLineJoin = 'round', lineCap: CanvasLineCap = 'round') {
    this.ctx = ctx
    this.brush = null
    this.supBrush = null
    this.history = new History<path>()
    this.color = '#f00'
    // 初始化线型
    this.ctx.lineWidth = lineWidth
    this.ctx.lineJoin = lineJoin
    this.ctx.lineCap = lineCap
    this.ctx.strokeStyle = color

    this.width = this.ctx.canvas.scrollWidth
    this.height = this.ctx.canvas.scrollHeight
  }

  //#region
  set brushColor(val: strokeColor) {
    this.color = val
  }

  get brushColor(): strokeColor {
    return this.color
  }

  set brushWidth(val: number) {
    this.ctx.lineWidth = val
  }

  get burshWidth(): number {
    return this.ctx.lineWidth
  }

  set brushJoin(val: CanvasLineJoin) {
    this.ctx.lineJoin = val
  }

  get brushJoin(): CanvasLineJoin {
    return this.ctx.lineJoin
  }

  set brushCap(val: CanvasLineCap) {
    this.ctx.lineCap = val
  }

  get brushCap(): CanvasLineCap {
    return this.ctx.lineCap
  }
  //#endregion

  beginPath(): void {
    if (!this.brush) {
      this.brush = new Path2D()
    }
    this.history.clearRecover()
    this.history.push({
      path: this.brush,
      color: this.color,
      width: this.ctx.lineWidth,
      lineJoin: this.ctx.lineJoin,
      lineCap: this.ctx.lineCap,
      type: 'stroke'
    })
  }

  closePath(): void {
    this.brush = null
  }

  freeLine(beginPoint: Point, controlPoint: Point, endPoint: Point): void {
    this.brush?.moveTo(beginPoint.x, beginPoint.y)
    this.brush?.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
  }

  straightLine(beginPoint: Point, endPoint: Point): void {
    this.supBrush = this.brush ? this.brush : this.ctx
    if (this.supBrush === this.ctx) this.supBrush.beginPath()
    this.supBrush?.moveTo(beginPoint.x, beginPoint.y)
    this.supBrush?.lineTo(endPoint.x, endPoint.y)
  }

  circle(beginPoint: Point, endPoint: Point): void {
    this.supBrush = this.brush ? this.brush : this.ctx
    if (this.supBrush === this.ctx) this.supBrush.beginPath()
    const x_distance: number = endPoint.x - beginPoint.x
    const y_distance: number = endPoint.y - beginPoint.y
    const radius: number = Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2))
    this.supBrush?.arc(beginPoint.x, beginPoint.y, radius, 0, Math.PI * 2)
  }

  rect(beginPoint: Point, endPoint: Point): void {
    this.supBrush = this.brush ? this.brush : this.ctx
    if (this.supBrush === this.ctx) this.supBrush.beginPath()
    const x_distance: number = endPoint.x - beginPoint.x
    const y_distance: number = endPoint.y - beginPoint.y
    this.supBrush.rect(beginPoint.x, beginPoint.y, x_distance, y_distance)
  }

  paint(): void {
    this.clear()
    this.history.path.forEach((path) => {
      if (path.type === 'fill') {
        this.ctx.fillStyle = path.color
        this.ctx.fill(path.path)
      } else {
        this.ctx.strokeStyle = path.color
        this.ctx.stroke(path.path)
      }
    })
    this.ctx.strokeStyle = this.color
    if (this.supBrush === this.ctx) this.supBrush.stroke()
  }

  fill(point: Point): void {
    this.history.path.forEach((path) => {
      if (this.ctx.isPointInPath(path.path, point.x, point.y)) {
        this.history.push({
          path: path.path,
          color: this.color,
          width: this.ctx.lineWidth,
          lineJoin: this.ctx.lineJoin,
          lineCap: this.ctx.lineCap,
          type: 'fill'
        })
      }
    })
  }

  revoke(): void {
    this.history.revoke()
    this.paint()
  }

  cancaelRevoke(): void {
    this.history.cancel()
    this.paint()
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
export default Brush
