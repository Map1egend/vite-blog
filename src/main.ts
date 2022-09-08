import { createApp } from 'vue'
import './style.css'
import 'virtual:windi.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import createFontAwesome from '@assets/fonts/awesome'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createFontAwesome, { name: 'font-awesome-icon' })
app.use(ElementPlus)
app.mount('#app')
