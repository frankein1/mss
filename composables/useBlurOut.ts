import { Ref } from 'vue'
import { isNode } from '~/utils/nodeCheck'

export function useBlurOut($el: Ref<HTMLElement | null>) {
  const isFocused = ref<boolean>(false)

  function onFocusInEl() {
    isFocused.value = true
  }

  function onBlurInEl(event: FocusEvent) {
    if (!isNode(event.relatedTarget)) {
      isFocused.value = false
      return
    }
    const isWithinEl = $el.value?.contains(event.relatedTarget)
    if (!isWithinEl) {
      isFocused.value = false
    }
  }

  onMounted(() => {
    $el.value?.addEventListener('focus', onFocusInEl, true)
    $el.value?.addEventListener('blur', onBlurInEl, true)
  })

  onUnmounted(() => {
    $el.value?.removeEventListener('focus', onFocusInEl, true)
    $el.value?.removeEventListener('blur', onBlurInEl, true)
  })

  return { isFocused }
}
