<template>
  <canvas id="canvas" ref="canvasRef" @dragover.prevent @drop="drop"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import Brush from '@utils/brush'
import useBrush from '@hooks/canvas/useBrush'
import useDrawBoardEvent from '@hooks/canvas/useDrawBoardEvent'
import { useCanvasStore } from '@store/canvasStore'
import Point from '@utils/point'

export default defineComponent({
  name: 'DrawBoard',
  setup() {
    let canvasRef = ref<HTMLCanvasElement | null>(null)
    let ctx: CanvasRenderingContext2D | null | undefined = null
    let brush1: Brush
    const canvasStore = useCanvasStore()
    let brushMap = new Map<string, ((e: MouseEvent) => void)[]>()

    let downEvent: (e: MouseEvent) => void
    let upEvent: (e: MouseEvent) => void
    watch(
      () => canvasStore.brushType,
      (newV) => {
        const Events = brushMap.get(newV)
        if (Events?.length) {
          downEvent = Events[0]
          upEvent = Events[1]
        }
      },
      {
        immediate: true
      }
    )
    watch(
      () => canvasStore.brushColor,
      (newV) => {
        console.log('changeColor')
        brush1.brushColor = newV
      }
    )

    onMounted(() => {
      if (canvasRef.value && canvasRef.value.parentElement) {
        canvasRef.value.width = canvasRef.value.parentElement.clientWidth as number
        canvasRef.value.height = canvasRef.value.parentElement.clientHeight as number
      }

      ctx = canvasRef.value?.getContext('2d')
      if (ctx instanceof CanvasRenderingContext2D) {
        brush1 = new Brush(ctx)
        const { freeLineDown, freeLineUp, straightLineDown, straightLineUp, circleDown, circleUp, rectDown, rectUp, fill } = useBrush(brush1)
        const { keyboardEvents } = useDrawBoardEvent(brush1)
        brushMap.set('brush-pencil', [freeLineDown, freeLineUp])
        brushMap.set('brush-pen-ruler', [straightLineDown, straightLineUp])
        brushMap.set('brush-circle', [circleDown, circleUp])
        brushMap.set('brush-square', [rectDown, rectUp])

        const handleMouseDown: (e: MouseEvent) => void = (e: MouseEvent) => {
          if (typeof downEvent === 'function') {
            downEvent(e)
          } else {
            return
          }
        }

        const handleMouseUp: (e: MouseEvent) => void = (e: MouseEvent) => {
          if (typeof upEvent === 'function') {
            upEvent(e)
          } else {
            return
          }
        }

        canvasRef.value?.addEventListener('mousedown', handleMouseDown)
        canvasRef.value?.addEventListener('mouseup', handleMouseUp)
        // 撤销
        document.addEventListener('keydown', keyboardEvents)

        animate()
      }
    })

    const animate = () => {
      brush1.paint()
      requestAnimationFrame(animate)
    }

    const drop = function (event: DragEvent): void {
      const originType = canvasStore.brushType
      canvasStore.brushType = 'fill'
      brush1.beginPath()
      brush1.fill(new Point(event.offsetX, event.offsetY))
      brush1.closePath()
      canvasStore.brushType = originType
    }

    return {
      canvasRef,
      drop
    }
  }
})
</script>

<style lang="scss">
#canvas {
  background-color: #fff;
}
</style>
