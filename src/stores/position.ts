import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/tauri'

export interface PositionConfig {
  width: number
  height: number
  x: number
  y: number
}

export const usePosition = defineStore('position', {
  state: () => ({
    width: 400,
    height: 600,
    x: 0,
    y: 0,
  }),
  getters: {
    getConfig() {
      return () => {
        const localConfigString = localStorage.getItem('position')
        if (!localConfigString)
          return { width: 400, height: 600, x: 0, y: 0 }
        const localConfig = JSON.parse(localConfigString) as PositionConfig
        return localConfig
      }
    },
  },
  actions: {
    async storeConfig() {
      const conf = await invoke('get_viewer_pos_and_size') as PositionConfig
      this.width = conf.width
      this.height = conf.height
      this.x = conf.x
      this.y = conf.y
      localStorage.setItem('position', JSON.stringify(conf))
    },
  },
})
