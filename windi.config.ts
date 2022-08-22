import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  theme: {
    triangleTop: {},
    extend: {
      transitionProperty: {
        'max-h': 'max-height'
      }
    }
  },
  shortcuts: {
    'tools-panel-item': 'flex-none rounded-md w-10 h-10 cursor-pointer leading-10',
    'triangle-top': 'w-0 h-0 border-5 border-white border-solid border-t-transparent border-l-transparent border-r-transparent'
  }
})
