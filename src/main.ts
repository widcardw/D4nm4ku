import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { Buffer } from 'buffer/'
import { WebviewWindow } from '@tauri-apps/api/window'
import { tryOnUnmounted } from '@vueuse/core'
import App from './App.vue'
import { pinia } from '~/stores'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

(window as any).Buffer = Buffer
const app = createApp(App)
// const pinia = createPinia()

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

app.use(pinia)

app.use(router)
app.mount('#app')

const mainWindow = WebviewWindow.getByLabel('main');
(async () => {
  const unlisten = await mainWindow?.onCloseRequested((_event) => {
    const danmakuWindow = WebviewWindow.getByLabel('danmakuWidget')
    if (danmakuWindow)
      danmakuWindow.close()
  })

  tryOnUnmounted(() => {
    unlisten?.()
  })
})()

