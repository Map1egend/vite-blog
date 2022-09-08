<template>
  <basic-layout>
    <template #header>
      <header>
        <div class="title">Daily Music 控制面板</div>
      </header>
    </template>
    <template #content>
      <div class="content-wrapper">
        <div class="music">
          <drag-upload v-model:file-list="fileList"></drag-upload>
          <preview-picture :img-src="imgSrc"></preview-picture>
          <el-button @click="isClip = !isClip">裁剪</el-button>
          <ml-clip :origin="imgSrc" v-if="isClip"></ml-clip>
        </div>
        <div class="lyric"></div>
      </div>
    </template>
  </basic-layout>
</template>

<script lang="ts">
  import BasicLayout from './layouts/BasicLayout.vue'
  import DragUpload from '@components/upload/DragUpload.vue'
  import PreviewPicture from '@components/preview/Picture.vue'
  import MlClip from '@components/clip/MlClip.vue'
  import { defineComponent, ref, watch } from 'vue'

  export default defineComponent({
    name: 'DailyMusic',
    components: { BasicLayout, DragUpload, PreviewPicture, MlClip },
    setup() {
      let fileList = ref<FileList>()
      let imgSrc = ref<string>('')
      let isClip = ref<boolean>(false)

      watch(fileList, (file) => {
        if (file?.length) {
          imgSrc.value = URL.createObjectURL(file[0])
        }
      })

      return {
        fileList,
        imgSrc,
        isClip
      }
    }
  })
</script>

<style lang="scss">
  header {
    padding: 16px 32px;
    font-size: 14px;
    line-height: 1.5;

    .title {
      font-weight: 600;
    }
  }

  .content-wrapper {
    background-color: #fff;

    input[type='file'] {
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    .music {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      color: #000;
    }
  }
</style>
