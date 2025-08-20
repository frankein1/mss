import type { Ref } from 'vue'

export function useBlurOut($el: Ref<HTMLElement | null>) {
  const isFocused = ref<boolean>(false)

  function onFocusInEl() {
    isFocused.value = true
  }

  function onBlurInEl() {
    setTimeout(() => {
      isFocused.value = false
    }, 300)
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
