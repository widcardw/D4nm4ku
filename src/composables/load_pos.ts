import { invoke } from '@tauri-apps/api/tauri'
import type { PositionConfig } from '~/stores/position'

async function loadPos(conf: PositionConfig) {
  const res = await invoke('set_viewer_pos_and_size', { conf })
  return res
}

export {
  loadPos,
}
