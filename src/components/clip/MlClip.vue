<template>
  <div class="clip">
    <div class="crop-box" :style="cropBoxStyle" ref="cropRef"></div>
    <div class="mask"></div>
    <img :src="origin" ref="originSource" />
  </div>
  <canvas width="268" height="268" ref="canvasRef"></canvas>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, reactive } from 'vue'
  export default defineComponent({
    name: 'MlClip',
    props: {
      origin: {
        type: String,
        required: true
      }
    },
    setup(props) {
      let cropRef = ref<HTMLDivElement>()
      let canvasRef = ref<HTMLCanvasElement>()
      let ctx: CanvasRenderingContext2D | null = null
      let originSource = ref<HTMLImageElement>()

      let initMouse = {
        x: 0,
        y: 0,
        minL: 0,
        maxL: 0,
        minT: 0,
        maxT: 0
      }

      const cropBoxStyle = reactive({
        width: '268px',
        height: '268px',
        left: '0px',
        top: '0px',
        background: `no-repeat url(${props.origin})`,
        backgroundPosition: `left 0px top 0px`,
        backgroundSize: '0px 0px'
      })

      const cropMove = function (e: MouseEvent) {
        const left = e.clientX
        const top = e.clientY
        if (cropRef.value) {
          const range = function (min: number, max: number) {
            return function (num: number): number {
              let result: number = num
              if (num < min) result = min
              if (num > max) result = max
              return result
            }
          }
          const legalL = range(initMouse.minL, initMouse.maxL)
          const legalT = range(initMouse.minT, initMouse.maxT)
          let left = legalL(e.clientX - initMouse.x)
          let top = legalT(e.clientY - initMouse.y)
          cropRef.value.style.left = left + 'px'
          cropRef.value.style.top = top + 'px'
          cropRef.value.style.backgroundPosition = `left ${-left}px top ${-top}px`
        }
      }

      onMounted(() => {
        if (cropRef.value) {
          cropRef.value.addEventListener('mousedown', function (e: MouseEvent) {
            initMouse.x = e.clientX - this.offsetLeft
            initMouse.y = e.clientY - this.offsetTop
            if (originSource.value) {
              const originSourceBox = originSource.value?.getBoundingClientRect()
              console.log(this.clientWidth)
              initMouse.maxL = originSourceBox.right - this.clientWidth - originSourceBox.left
              initMouse.maxT = originSourceBox.bottom - this.clientHeight - originSourceBox.top
            }
            cropRef.value?.addEventListener('mousemove', cropMove)
          })
          cropRef.value.addEventListener('mouseup', function () {
            cropRef.value?.removeEventListener('mousemove', cropMove)
          })
          cropRef.value.removeEventListener('mouseleave', cropMove)
        }
        if (canvasRef.value) {
          ctx = canvasRef.value?.getContext('2d')
        }
        if (originSource.value) {
          originSource.value.addEventListener('load', () => {
            const width = originSource.value?.clientWidth
            const height = originSource.value?.height
            cropBoxStyle.backgroundSize = `${width}px ${height}px`
          })
        }
      })

      return {
        cropRef,
        canvasRef,
        originSource,
        cropBoxStyle
      }
    }
  })
</script>

<style lang="scss">
  .clip {
    position: relative;

    .crop-box {
      position: absolute;
      border: 1px solid #fff;
      z-index: 100;
      cursor: grab;
    }

    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.4);
      z-index: 99;
    }
  }
</style>
