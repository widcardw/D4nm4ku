export interface MessageProvider {
  pushMsg(msg: string, config?: MessageProviderOptions): void
}

export interface MessageProviderOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  ttl?: number
}
