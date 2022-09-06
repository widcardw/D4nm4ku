import type { InjectionKey, Ref } from 'vue'
import type UMessageProvider from '~/components/ui/UMessageProvider.vue'

export const msgKey: InjectionKey<Ref<typeof UMessageProvider>> = Symbol('')
