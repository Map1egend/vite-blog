import Stack from '@utils/Stack'

export default class History<T> {
  private _mainStack: Stack<T>
  private _recoverStack: Stack<T>

  constructor() {
    this._mainStack = new Stack<T>()
    this._recoverStack = new Stack<T>()
  }

  get path(): Stack<T> {
    return this._mainStack
  }

  revoke(): void {
    const voke: T = this._mainStack.pop()
    if (voke) {
      this._recoverStack.push(voke)
    }
  }

  cancel(): void {
    const cover: T = this._recoverStack.pop()
    if (cover) {
      this._mainStack.push(cover)
    }
  }

  push(path: T): number {
    return this._mainStack.push(path)
  }

  clearMain(): T[] {
    return this._mainStack.clear()
  }

  clearRecover(): T[] {
    return this._recoverStack.clear()
  }
}
