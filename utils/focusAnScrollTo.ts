import VueScrollTo from 'vue-scrollto'

export function focusAndScrollTo(selector: string) {
  // Prevent scroll and then trigger it on purpose as the native focus scroll can cause a weird jump back to the top on page access
  const element: HTMLElement | null = document.querySelector(selector)
  element?.focus({ preventScroll: true })
  VueScrollTo.scrollTo(selector, 300, {
    easing: 'linear',
    offset: -50
  })
}
