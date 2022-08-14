import { sendMsg } from './msgSend'
import { useStore } from '~/stores/store'

interface Answer {
  ts: number
  keywords: string[]
  answer: string
}

const store = useStore()

function addFAQ(ans: Omit<Answer, 'ts'>) {
  store.faqs.push({
    ...ans,
    ts: Date.now(),
  })
}

function removeFAQ(index: number) {
  store.faqs.splice(index, 1)
}

const sentQueue: number[] = []

function enqueueAnswerTs(ts: number) {
  sentQueue.push(ts)

  setTimeout(() => {
    sentQueue.shift()
  }, 30000)
}

function autoSendByIndex(index: number) {
  // 已经发过的暂时不发
  if (sentQueue.find(it => it === store.getFaqs[index].ts))
    return

  enqueueAnswerTs(store.getFaqs[index].ts)

  try {
    sendMsg(store.getFaqs[index].answer)
    // // eslint-disable-next-line no-console
    // console.log(store.getFaqs[index].answer)
  }
  catch (e: any) {
    throw new Error(e.toString())
  }
}

function autoSendByWord(word: string) {
  for (const [index, faq] of store.getFaqs.entries()) {
    for (const kw of faq.keywords) {
      if (word.includes(kw)) {
        autoSendByIndex(index)
        return
      }
    }
  }
}

export {
  addFAQ,
  removeFAQ,
  autoSendByWord,
}

export type {
  Answer,
}
