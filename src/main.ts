import { createApp } from 'vue'
import './style.css'
import 'virtual:windi.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import createFontAwesome from '@assets/fonts/awesome'

const app = createApp(App)
app.use(createPinia())
app.use(createFontAwesome, { name: 'font-awesome-icon' })
app.mount('#app')
