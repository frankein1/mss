const FOCUSABLE_SELECTOR =
  'input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default defineNuxtPlugin(nuxtApp => {
  /**
   * `v-autofocus` — focuses the first focusable child when the element is mounted.
   * With an argument (`v-autofocus="'select'"`) targets that CSS selector instead.
   */
  nuxtApp.vueApp.directive<HTMLElement, string>('autofocus', {
    mounted(el, binding) {
      const selector = binding.value || FOCUSABLE_SELECTOR
      el.querySelector<HTMLElement>(selector)?.focus()
    }
  })
})
