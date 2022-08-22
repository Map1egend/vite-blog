import { onMounted, reactive, toRefs } from 'vue'
import iro from '@jaames/iro'
import { useCanvasStore } from '@store/canvasStore'

interface State {
  colorPicker: iro.ColorPicker | null
}

export default function useColorPicker(rootElement: string) {
  if (!/^#\w+/gi.test(rootElement)) {
    return
  }

  const state = reactive<State>({
    colorPicker: null
  })

  const canvasStore = useCanvasStore()

  onMounted(() => {
    state.colorPicker = iro.ColorPicker('#picker', {
      //设置颜色选择器的大小
      width: 240,
      //将初始颜色设置为纯红色
      color: '#f00',
      margin: 4,
      layout: [
        {
          component: iro.ui.Box
        },
        {
          component: iro.ui.Slider,
          options: {
            id: 'hue-slider',
            sliderType: 'hue',
            padding: 1
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            id: 'saturation-slider',
            sliderType: 'saturation',
            padding: 1
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            id: 'value-slider',
            sliderType: 'value',
            padding: 1
          }
        }
      ]
    })

    state.colorPicker.on('input:end', function (color: any) {
      console.log(color)
      canvasStore.brushColor = color.hexString
    })
  })
}
