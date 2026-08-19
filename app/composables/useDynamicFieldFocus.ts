import type { ComponentPublicInstance } from 'vue'

const FOCUSABLE_SELECTOR =
  'input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getElement<T extends HTMLElement | ComponentPublicInstance>(
  ref: T | null | undefined
): HTMLElement | null {
  if (!ref) {
    return null
  }
  if (ref instanceof HTMLElement) {
    return ref
  }
  return ref.$el ?? null
}

export function useDynamicFieldFocus(
  containerRef: Ref<HTMLElement | ComponentPublicInstance | null | undefined>,
  sectionSelector = '[data-field-group]'
) {
  function focusElementAdded() {
    const container = getElement(containerRef.value)
    if (!container) {
      return
    }

    nextTick(() => {
      const sections = container.querySelectorAll<HTMLElement>(sectionSelector)
      const target = sections[sections.length - 1] ?? container
      target.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()
    })
  }

  return { focusElementAdded }
}
