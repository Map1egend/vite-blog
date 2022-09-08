<template>
  <div class="draw-head pos-ab">
    <div class="left">
      <ToolsPanel />
    </div>
    <div class="right">head-right</div>
  </div>
  <div class="draw-content">
    <DrawBoard />
  </div>
  <div class="draw-foot pos-ab">
    <div class="left">foot-left</div>
    <div class="right">foot-right</div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import DrawBoard from '@components/DrawBoard/DrawBoard.vue'
  import ToolsPanel from '@components/DrawBoard/ToolsPanel.vue'

  export default defineComponent({ components: { DrawBoard, ToolsPanel } })
</script>

<style lang="scss" scoped>
  .pos-ab {
    position: absolute;
  }
  .draw-head {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 88px;
  }

  .draw-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 88px 0;
    height: calc(100vh - 176px);
  }

  .draw-foot {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 88px;
    bottom: 0;
  }
</style>
