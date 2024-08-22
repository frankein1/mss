/** https://accessibleweb.com/question-answer/after-closing-exposed-content-should-focus-return-to-the-ui-component-that-exposed-it/ */

export function setFocusAfterClose(
  selector: HTMLElement | string = 'form',
  tag: keyof HTMLElementTagNameMap = 'input'
) {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector
  if (!el) {
    return () => {}
  }

  const tofocus = el.querySelector(tag)

  return () => {
    console.debug(tofocus)
    tofocus?.focus()
  }
}
