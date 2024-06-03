import VueScrollTo from 'vue-scrollto'

export function focusAndScrollTo(selector: string | HTMLElement) {
  // Prevent scroll and then trigger it on purpose as the native focus scroll can cause a weird jump back to the top on page access
  const element: HTMLElement | null =
    typeof selector === 'string' ? document.querySelector(selector) : selector
  console.log(element)
  element?.focus({ preventScroll: true })
  console.log('focus done')
  VueScrollTo.scrollTo(selector, 300, {
    easing: 'linear',
    offset: -50
  })
  console.log('scroll done')
}
