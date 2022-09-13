<template>
  <div class="clip">
    <div class="crop-box" :style="cropBoxStyle" ref="cropRef"></div>
    <div class="mask"></div>
    <img :src="origin" ref="originSource" />
  </div>
  <canvas width="536" height="536" ref="canvasRef"></canvas>
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
    expose: ['getDataURL', 'getFile'],
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
      let imgRatio = 1

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

          if (canvasRef.value && originSource.value) {
            ctx?.clearRect(0, 0, 536, 536)
            ctx?.drawImage(originSource.value, left * imgRatio, top * imgRatio, 268 * imgRatio, 268 * imgRatio, 0, 0, 268 * devicePixelRatio, 268 * devicePixelRatio)
          }
        }
      }

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
        if (cropRef.value) {
          cropRef.value.addEventListener('mousedown', function (e: MouseEvent) {
            initMouse.x = e.clientX - this.offsetLeft
            initMouse.y = e.clientY - this.offsetTop
            if (originSource.value) {
              const originSourceBox = originSource.value?.getBoundingClientRect()
              initMouse.maxL = originSourceBox.right - this.clientWidth - originSourceBox.left
              initMouse.maxT = originSourceBox.bottom - this.clientHeight - originSourceBox.top
            }
            cropRef.value?.addEventListener('mousemove', cropMove)
          })
          cropRef.value.addEventListener('mouseup', function () {
            cropRef.value?.removeEventListener('mousemove', cropMove)
          })
          cropRef.value.addEventListener('mouseleave', function () {
            cropRef.value?.removeEventListener('mousemove', cropMove)
          })
        }
        if (canvasRef.value) {
          ctx = canvasRef.value?.getContext('2d')
        }
        if (originSource.value) {
          originSource.value.addEventListener('load', () => {
            const width = originSource.value?.clientWidth
            const height = originSource.value?.height
            cropBoxStyle.backgroundSize = `${width}px ${height}px`
            originSource.value && (imgRatio = originSource.value?.naturalWidth / originSource.value?.width)
          })
        }
      })

      return {
        cropRef,
        canvasRef,
        originSource,
        cropBoxStyle,
        getDataURL,
        getFile
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

  canvas {
    transform: scale(0.5);
    transform-origin: 0 0;
  }

  canvas,
  img {
    user-select: none;
  }
</style>