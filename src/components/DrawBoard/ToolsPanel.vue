<template>
  <div class="tools-panel-container flex">
    <DropDownBox v-for="item in toolPanelList" :key="item.id" :dropData="item.children" :icon="item.icon" />
    <DropDownBox icon="fa-solid fa-fill-drip" draggable="true" />
    <DropDownBox icon="fa-solid fa-palette">
      <div id="picker"></div>
    </DropDownBox>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import DropDownBox from '@components/DropDownBox.vue'
  import useList from '@hooks/useList'
  import useColorPicker from '@hooks/useColorPicker'

  export default defineComponent({
    name: 'ToolsVue',
    components: { DropDownBox },
    setup() {
      let toolPanelList = useList('DRAW_TOOLS_PANEL_LIST')
      useColorPicker('#picker')

      return {
        toolPanelList
      }
    }
  })
</script>

<style lang="scss" scoped></style>
