<template>
  <div class="clip" ref="clipRef" @mouseleave="scaleEnd">
    <div class="crop-box" :style="cropBoxStyle" ref="cropRef">
      <div class="cropbox-resize nw" @mousedown.capture.stop="scaleStart" @mouseup.capture="scaleEnd"></div>
      <div class="cropbox-resize ne" @mousedown.capture.stop="scaleStart" @mouseup.capture="scaleEnd"></div>
      <div class="cropbox-resize se" @mousedown.capture.stop="scaleStart" @mouseup.capture="scaleEnd"></div>
      <div class="cropbox-resize sw" @mousedown.capture.stop="scaleStart" @mouseup.capture="scaleEnd"></div>
    </div>
    <div class="mask" ref="mask"></div>
    <img :src="origin" ref="originSource" />
  </div>
  <canvas width="536" height="536" ref="canvasRef"></canvas>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, reactive, Ref, watch } from 'vue'
  import useMove from '@hooks/useMove'
  export default defineComponent({
    name: 'MlClip',
    props: {
      origin: {
        type: String,
        required: true
      }
    },
    expose: ['getDataURL', 'getFile'],
    setup(props) {
      let clipRef = ref<HTMLDivElement>()
      let cropRef = ref<HTMLDivElement>()
      let canvasRef = ref<HTMLCanvasElement>()
      let ctx: CanvasRenderingContext2D
      let originSource = ref<HTMLImageElement>()

      let imgRatio = 1
      let initRect: DOMRect
      let clipRect: DOMRect

      let left: Ref<number>, top: Ref<number>

      const cropBoxStyle = reactive({
        width: '268px',
        height: '268px',
        left: `0px`,
        top: `0px`,
        background: `no-repeat url(${props.origin})`,
        backgroundPosition: `left 0px top 0px`,
        backgroundSize: '0px 0px'
      })

      const getDataURL = function (): string {
        if (canvasRef.value) {
          return canvasRef.value.toDataURL('image/jpeg')
        }
        return '@assets/imgs/clip_bg.png'
      }

      const b64ToUint6 = function (nChr: number) {
        return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0
      }
      const base64DecToArr = function (sBase64: string, nBlockSize?: number) {
        let sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, '')
        let nInLen = sB64Enc.length
        let nOutLen = nBlockSize ? Math.ceil(((nInLen * 3 + 1) >>> 2) / nBlockSize) * nBlockSize : (nInLen * 3 + 1) >>> 2
        let aBytes = new Uint8Array(nOutLen)

        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
          nMod4 = nInIdx & 3
          nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << (18 - 6 * nMod4)
          if (nMod4 === 3 || nInLen - nInIdx === 1) {
            for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
              aBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255
            }
            nUint24 = 0
          }
        }

        return aBytes
      }

      const getFile = function (filename: string): File {
        const dataURL = getDataURL()
        const arr = dataURL.split(',')
        const mime = arr[0].match(/:(.*?);/)![1]
        let u8arr = base64DecToArr(arr[1])
        return new File([u8arr], filename, { type: mime })
      }

      onMounted(() => {
        ;({ left, top } = useMove(cropRef.value, originSource.value))

        watch(
          () => ({ left: left.value, top: top.value }),
          ({ left, top }) => {
            cropBoxStyle.left = left + 'px'
            cropBoxStyle.top = top + 'px'
            cropBoxStyle.backgroundPosition = `left ${-left}px top ${-top}px`

            ctx?.clearRect(0, 0, 536, 536)
            ctx?.drawImage(
              originSource.value!,
              left * imgRatio,
              top * imgRatio,
              parseFloat(cropBoxStyle.width) * imgRatio,
              parseFloat(cropBoxStyle.height) * imgRatio,
              0,
              0,
              268 * devicePixelRatio,
              268 * devicePixelRatio
            )
          }
        )

        if (canvasRef.value) {
          ctx = canvasRef.value?.getContext('2d') as CanvasRenderingContext2D
        }
        if (originSource.value) {
          originSource.value.addEventListener('load', () => {
            const width = originSource.value?.clientWidth
            const height = originSource.value?.height
            cropBoxStyle.backgroundSize = `${width}px ${height}px`
            originSource.value && (imgRatio = originSource.value?.naturalWidth / originSource.value?.width)
            initRect = cropRef.value?.getBoundingClientRect() as DOMRect
            clipRect = clipRef.value?.getBoundingClientRect() as DOMRect
          })
        }
      })

      let cssScale = `scale(${1 / devicePixelRatio})`

      const move = function (event: Event) {
        if (event instanceof MouseEvent) {
          let width = event.clientX - initRect.left
          let height = event.clientY - initRect.top

          if (event.clientX > clipRect.right) {
            width = clipRect.right - initRect.left
          }
          if (event.clientY > clipRect.bottom) {
            height = clipRect.bottom - initRect.top
          }

          cropBoxStyle.width = width + 'px'
          cropBoxStyle.height = height + 'px'
        }
      }
      const scaleStart = function () {
        initRect = cropRef.value?.getBoundingClientRect() as DOMRect
        clipRect = clipRef.value?.getBoundingClientRect() as DOMRect
        clipRef.value?.addEventListener('mousemove', move, true)
      }
      const scaleEnd = function () {
        clipRef.value?.removeEventListener('mousemove', move, true)
      }

      return {
        clipRef,
        cropRef,
        canvasRef,
        originSource,
        cropBoxStyle,
        getDataURL,
        getFile,
        cssScale,
        scaleStart,
        scaleEnd
      }
    }
  })
</script>

<style lang="scss">
  .clip {
    position: relative;

    .crop-box {
      box-sizing: content-box;
      position: absolute;
      z-index: 100;
      border: 3px solid #000;
      cursor: grab;

      .cropbox-resize {
        position: absolute;
        width: 32px;
        height: 32px;
        background-color: red;
        border-radius: 50%;
      }

      .nw {
        left: -16px;
        top: -16px;
        cursor: nw-resize;
      }

      .ne {
        left: calc(100% - 16px);
        top: -16px;
        cursor: ne-resize;
      }

      .se {
        left: calc(100% - 16px);
        top: calc(100% - 16px);
        cursor: se-resize;
      }

      .sw {
        left: -16px;
        top: calc(100% - 16px);
        cursor: sw-resize;
      }
    }

    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.4);
      z-index: 99;
    }
  }

  canvas {
    transform: v-bind(cssScale);
    transform-origin: 0 0;
  }

  canvas,
  img {
    user-select: none;
  }
</style>
