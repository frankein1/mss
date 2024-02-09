export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive<HTMLElement, string>('autofocus', {
    mounted(el, tagName) {
      if (tagName.value) {
        el.querySelector<HTMLElement>(tagName.value)?.focus()
      } else {
        el.focus()
      }
    }
  })
})
