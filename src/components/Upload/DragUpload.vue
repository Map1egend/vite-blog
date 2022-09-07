<template>
  <div class="popup-content" @click="upload" @drop.stop.prevent="dragUpload" @dragenter.stop.prevent @dragover.stop.prevent>
    <input type="file" ref="fileRef" @change="chooseFile" />
    <div class="image"></div>
    <div class="title">Drag & Drop or <a>browse</a></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DragUpload',
  props: ['fileList'],
  emits: ['update:fileList'],
  setup(props, { emit }) {
    let fileRef = ref<HTMLInputElement | null>(null)

    const upload = function (): void {
      if (fileRef.value instanceof HTMLInputElement) {
        fileRef.value.click()
      }
    }

    const dragUpload = function (event: DragEvent): void {
      emit('update:fileList', event.dataTransfer?.files)
    }

    const chooseFile = function () {
      if (fileRef.value instanceof HTMLInputElement) {
        emit('update:fileList', fileRef.value.files)
      }
    }

    return {
      fileRef,
      upload,
      dragUpload,
      chooseFile
    }
  }
})
</script>

<style lang="scss">
.image,
.title {
  cursor: pointer;
  user-select: none;
}

.popup-content {
  width: 200px;

  .image {
    width: 200px;
    height: 150px;
    background: center / contain no-repeat url('@assets/imgs/upload.png');
    transition: transform 0.5s ease;
    margin-bottom: 10px;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
