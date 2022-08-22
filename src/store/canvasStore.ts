import { defineStore } from 'pinia'

export const useCanvasStore = defineStore('canvasStore', {
  state: () => ({
    brushType: '',
    brushColor: '#fff',
    brushWidth: 1
  }),
  actions: {}
})
