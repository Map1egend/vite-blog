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
          <drag-upload></drag-upload>
        </div>
        <div class="lyric"></div>
      </div>
    </template>
  </basic-layout>
</template>

<script lang="ts">
import BasicLayout from './layouts/BasicLayout.vue'
import DragUpload from '@components/Upload/DragUpload.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DailyMusic',
  components: { BasicLayout, DragUpload },
  setup() {
    return {}
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
