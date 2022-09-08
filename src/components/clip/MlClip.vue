<template>
  <el-dialog :model-value="true" title="裁剪">
    <div class="clip">
      <div class="crop-box" :style="cropBoxStyle"></div>
      <div class="mask"></div>
      <img :src="origin" ref="originSource" />
    </div>
    <canvas width="268" height="268" ref="canvasRef"></canvas>
  </el-dialog>
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
      let canvasRef = ref<HTMLCanvasElement>()
      let ctx: CanvasRenderingContext2D | null = null
      let originSource = ref<HTMLImageElement>()

      const cropBoxStyle = reactive({
        width: '268px',
        height: '268px',
        left: '0px',
        top: '0px',
        backgroundImage: `url(${props.origin})`,
        // backgroundPosition: `left ${100}px top ${100}px`,
        backgroundSize: '472px 717px'
      })

      onMounted(() => {
        if (canvasRef.value) {
          ctx = canvasRef.value?.getContext('2d')
        }
      })

      return {
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
