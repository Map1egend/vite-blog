class Point {
  // 公有属性
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static midPoint(p1: Point, p2: Point): Point {
    const x = (p1.x + p2.x) / 2
    const y = (p1.y + p2.y) / 2
    return new Point(x, y)
  }

  add(p: Point): Point {
    this.x += p.x
    this.y += p.y
    return this
  }

  subtract(p: Point): Point {
    this.x -= p.x
    this.y -= p.y
    return this
  }

  multiply(p: Point): number {
    return this.x * p.x + this.y * p.y
  }
}

export default Point
