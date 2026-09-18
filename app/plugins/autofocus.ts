export default defineNuxtPlugin(nuxtApp => {
  /**
   * `v-autofocus` — moves keyboard focus when the element is mounted.
   *
   * - Without argument (`<button v-autofocus>`): focuses the element itself,
   *   which must be focusable (native control, link or `tabindex="-1"`).
   * - With a CSS selector (`v-autofocus="'textarea'"`): focuses the first
   *   matching descendant; no-op if none.
   *
   * Runs on `mounted` only, so it fires again whenever the element is
   * re-created (`v-if`, `key` change), even without user action. Do not use it
   * for dynamically revealed form fields: use `useDynamicFieldFocus` instead
   * (see .claude/rules/8-accessibility.md).
   */
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
