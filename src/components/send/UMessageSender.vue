<script setup lang="ts">
import { sendMsg } from '~/composables/msgSend'
import UInputBtn from '~/components/ui/UInputBtn.vue'

withDefaults(defineProps<{
  noBorder?: boolean
}>(), {
  noBorder: false,
})

const msg = ref('')
const btnDisabled = ref(false)
const msgRef = inject('msgRef') as any

const sendMessage = () => {
  if (msg.value.trim() === '') {
    msgRef.value.pushMsg({
      type: 'warning',
      content: '发送的消息不能为空！',
    })
    return
  }

  btnDisabled.value = true
  sendMsg(msg.value)
  setTimeout(() => {
    btnDisabled.value = false
  })
  msg.value = ''
}
</script>

<template>
  <UInputBtn
    v-model="msg"
    placeholder="Ctrl + Enter 发送"
    :btn-disabled="btnDisabled || msg.trim() === ''"
    :no-border="noBorder"
    @click-btn="sendMessage"
  >
    发送
  </UInputBtn>
</template>
