import App from './App.vue'
import router from './router'
import { useBus } from './store/bus'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd, {
  message,
  Modal
} from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// Globals
app.config.globalProperties.$bus = useBus()
app.config.globalProperties.$message = message
app.config.globalProperties.$modal = Modal

app.mount('#app')
