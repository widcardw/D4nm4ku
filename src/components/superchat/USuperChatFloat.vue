<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Avatar from '~/components/img/Avatar.vue'
import { getAvatar2 } from '~/composables/getAvatar'
import { msgKey } from '~/composables/injectionKeys'
import { LIGHTNESS_LIMIT, getLightnessFromHex } from '~/composables/randomColor'
import { useStore } from '~/stores/store'

const props = defineProps<{
  uname: string
  content: string
  contentJpn: string
  face: string
  price: number
  ts: number
  uid: number
  bgBottomColor: string
  bgColor: string
}>()

const store = useStore()
const lang = ref(store.config.scLang)
const showToggleLang = computed(() => props.contentJpn.trim() !== '')

function toggleLang() {
  if (lang.value === 'zh-cn')
    lang.value = 'ja-jp'
  else
    lang.value = 'zh-cn'
}

const faceUrl = ref(props.face)
const msgRef = inject(msgKey)
const urlIsBlob = ref(false)

if (props.face === '') {
  getAvatar2(props.uid)
    .then(({ url, isBlob }) => {
      faceUrl.value = url
      urlIsBlob.value = isBlob
    })
    .catch(() => {
      msgRef?.value.pushMsg('头像获取失败', { type: 'error' })
    })
}
// console.log(getLightnessFromRgb(props.bgBottomColor), getLightnessFromRgb(props.bgColor))
</script>

<template>
  <div w-full rounded text-white>
    <div
      flex items-center shadow space-x-2 p-2 rounded-t
      :style="{
        backgroundColor: bgColor,
        color: getLightnessFromHex(bgColor) > LIGHTNESS_LIMIT ? '#000' : '#fff',
      }"
    >
      <Avatar :src="faceUrl" :uid="uid" class="w-1.5rem h-1.5rem" />
      <div flex-1 text-shadow-none>
        {{ uname }}
      </div>
      <div text-shadow-none>
        ￥{{ price / 1000 }}
      </div>
      <div v-if="showToggleLang" icon-btn i-ri-translate-2 @click="toggleLang" />
    </div>
    <div
      p-2 rounded-b break-words
      :style="{
        backgroundColor: bgBottomColor,
        color: getLightnessFromHex(bgBottomColor) > LIGHTNESS_LIMIT ? '#000' : '#fff',
      }"
    >
      {{ lang === 'zh-cn' ? content : (contentJpn.trim() !== '' ? contentJpn : content) }}
    </div>
  </div>
</template>
