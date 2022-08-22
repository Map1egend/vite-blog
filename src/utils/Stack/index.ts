export default class Stack<T> {
  private _stack: T[]

  constructor() {
    this._stack = []
  }

  push(item: T): number {
    return this._stack.push(item)
  }

  pop(): T {
    return this._stack.splice(-1, 1)[0]
  }

  forEach(fn: (item: T, index: number, array: T[]) => void): void {
    this._stack.forEach(fn)
  }

  clear(): T[] {
    return this._stack.splice(0)
  }
}
