import { onMounted, ref } from 'vue'

function range(min: number, max: number): (num: number) => number {
  return function (num: number): number {
    if (num < min) return min
    if (num > max) return max
    return num
  }
}

export default function useMove(target: HTMLElement | undefined, parent: HTMLElement | undefined) {
  const left = ref<number>(0)
  const top = ref<number>(0)

  const initMouse = {
    x: 0,
    y: 0,
    minL: 0,
    maxL: 0,
    minT: 0,
    maxT: 0
  }

  if (!parent) {
    parent = document.querySelector('body')!
  }

  const move = function (e: MouseEvent) {
    const legelL = range(initMouse.minL, initMouse.maxL)
    const legelT = range(initMouse.minT, initMouse.maxT)

    left.value = legelL(e.clientX - initMouse.x)
    top.value = legelT(e.clientY - initMouse.y)
  }

  if (target) {
    target.addEventListener('mousedown', function (e: MouseEvent) {
      initMouse.x = e.clientX - this.offsetLeft
      initMouse.y = e.clientY - this.offsetTop
      const parentRect = parent!.getBoundingClientRect()
      initMouse.maxL = parentRect.right - this.clientWidth - parentRect.left
      initMouse.maxT = parentRect.bottom - this.clientHeight - parentRect.top
      target.addEventListener('mousemove', move)
    })
    target.addEventListener('mouseup', function () {
      target.removeEventListener('mousemove', move)
    })
    target.addEventListener('mouseleave', function () {
      target.removeEventListener('mousemove', move)
    })
  }

  return {
    left,
    top
  }
}
