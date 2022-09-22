<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Avatar from '~/components/img/Avatar.vue'
import { getAvatar2 } from '~/composables/getAvatar'
import { msgKey } from '~/composables/injectionKeys'
import { useStore } from '~/stores/store'

import { LIGHTNESS_LIMIT, getLightnessFromHex } from '~/composables/randomColor'

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
  second: number
}>()

const store = useStore()
const faceUrl = ref(props.face)
const msgRef = inject(msgKey)
const urlIsBlob = ref(false)
const lang = ref(store.config.scLang)
const showToggleLang = computed(() => props.contentJpn.trim() !== '')

function toggleLang() {
  if (lang.value === 'zh-cn')
    lang.value = 'ja-jp'
  else
    lang.value = 'zh-cn'
}

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
</script>

<template>
  <div w-full rounded>
    <div
      :style="{
        backgroundColor: bgColor,
        color: getLightnessFromHex(bgColor) > LIGHTNESS_LIMIT ? '#000' : '#fff',
      }"
      flex space-x-2 p-2 rounded-t
    >
      <Avatar w-3rem h-3rem :src="faceUrl" :uid="uid" :is-blob="urlIsBlob" />
      <div flex-1>
        <div font-bold text-lg text-shadow-none>
          {{ uname }}
        </div>
        <div text="sm" text-shadow-none>
          ￥{{ price / 1000 }}
        </div>
      </div>
      <div v-if="showToggleLang" icon-btn i-ri-translate-2 @click="toggleLang" />
    </div>
    <div
      :style="{
        backgroundColor: bgBottomColor,
        color: getLightnessFromHex(bgBottomColor) > LIGHTNESS_LIMIT ? '#000' : '#fff',
      }"
      p-2 rounded-b break-words
    >
      {{ lang === 'zh-cn' ? content : (contentJpn.trim() !== '' ? contentJpn : content) }}
    </div>
  </div>
</template>
