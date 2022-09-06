<script setup lang="ts">
import { inject, ref } from 'vue'
import { sendMsg } from '~/composables/msgSend'
import UInputBtn from '~/components/ui/UInputBtn.vue'
import { useStore } from '~/stores/store'
import { msgKey } from '~/composables/injectionKeys'

withDefaults(defineProps<{
  noBorder?: boolean
}>(), {
  noBorder: false,
})

const msg = ref('')
const btnDisabled = ref(false)
const msgRef = inject(msgKey)
const store = useStore()

const sendMessage = () => {
  if (msg.value.trim() === '') {
    msgRef?.value.pushMsg('发送的消息不能为空！', {
      type: 'warning',
    })
    return
  }
  try {
    btnDisabled.value = true
    sendMsg(msg.value)
    btnDisabled.value = false
    msg.value = ''
  }
  catch (e) {
    msgRef?.value.pushMsg('消息发送失败！请重新登录！', {
      type: 'error',
    })
  }
}
</script>

<template>
  <UInputBtn
    v-model="msg"
    placeholder="Ctrl + Enter 发送"
    :btn-disabled="btnDisabled || !store.getUserInfo.mid || msg.trim() === ''"
    :no-border="noBorder"
    @click-btn="sendMessage"
  >
    发送
  </UInputBtn>
</template>
