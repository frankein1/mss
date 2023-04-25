import mitt from 'mitt'

export default defineNuxtPlugin(() => ({
  provide: {
    globalEventEmitter: mitt()
  }
}))
