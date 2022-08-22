<template>
  <div class="drop-down-box min-w-10 overflow-scroll rounded shadow-md bg-white text-black relative mr-4px">
    <div class="tools-panel-item" tabindex="-1" ref="fatherRef" @click="visible = !visible" @blur="visible = false">
      <font-awesome-icon :icon="icon" />
      <Teleport to="body">
        <div v-if="dropData.length || $slots.default" class="dropdown absolute min-w-10 transition-max-h overflow-hidden" :class="[maxHeight]" :style="`left: ${pos.left}px; top: ${pos.top}px;`">
          <div class="triangle-top ml-4px"></div>
          <div class="bg-white rounded p-4px">
            <slot>
              <ul class="rounded">
                <li v-for="item in dropData" @click="changeActive($event, item.value)" :key="item.id" class="leading-10 cursor-pointer text-center hover:bg-gray-100 rounded">
                  <font-awesome-icon v-if="item.icon" :icon="item.icon" class="text-teal-500" />
                  <span v-else class="text-teal-500">{{ item.name }}</span>
                </li>
              </ul>
            </slot>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import usePosition, { Position } from '@hooks/usePosition'
import { useCanvasStore } from '@store/canvasStore'

export default defineComponent({
  props: {
    dropData: {
      type: Array<panelData>,
      default: () => []
    },
    icon: {
      type: String,
      default: 'fa-solid fa-percent'
    }
  },
  setup() {
    let visible = ref<boolean>(false)
    let maxHeight = computed(() => {
      return visible.value ? 'max-h-84' : 'max-h-0'
    })

    const getPos = usePosition(Position.LEFT_BOTTOM)
    let pos = ref<{ left: number; top: number }>({ left: 0, top: 0 })
    let fatherRef = ref<HTMLElement>()

    onMounted(() => {
      if (fatherRef.value instanceof HTMLElement) {
        pos.value = getPos(fatherRef.value) as { left: number; top: number }
      }
    })

    const canvasStore = useCanvasStore()

    const changeActive = function (e: MouseEvent, content: string | number): void {
      canvasStore.brushType = content as string
    }

    return {
      visible,
      changeActive,
      maxHeight,
      fatherRef,
      pos
    }
  }
})
</script>
