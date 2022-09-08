<template>
  <div class="preview-picture" ref="previewRef">
    <!-- <canvas width="268" height="268" ref="canvasRef"></canvas> -->
    <img :src="imgSrc" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue'

  export default defineComponent({
    name: 'PreviewPicture',
    props: {
      imgSrc: {
        type: String,
        required: true
      }
    },
    setup(props) {
      let imgSource = new Image(300, 300)
      let previewRef = ref<HTMLDivElement>()

      watch(
        () => props.imgSrc,
        (src) => {
          imgSource.src = src
          // previewRef.value?.appendChild(imgSource)
        }
      )

      return {
        previewRef
      }
    }
  })
</script>

<style lang="scss">
  .preview-picture {
    width: 268px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: repeat url('@assets/imgs/clip_bg.png');

    img {
      widows: 268px;
      height: 268px;
      object-fit: contain;
    }
  }
</style>
