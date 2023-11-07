import { Ref, ComputedRef } from 'vue'

export function useExpandMenu(
  expandableElement: Ref<HTMLElement | null>,
  optionValues: ComputedRef<string[]>,
  optionRefs: { [key: string]: Ref<HTMLElement | null> },
  disabled?: Ref<boolean>,
  disabledOptions?: Ref<string[]>
) {
  /**
   * Indicates whether the listbox is expanded or not
   */
  const expanded = ref<boolean>(false)

  /**
   * Prevent from closing the listbox on blur
   * It is used when an option is clicked
   */
  const ignoreBlur = ref<boolean>(false)

  /**
   * The active option index in the options list
   */
  const activeIndex = ref<number>(0)

  /**
   * The element containing the options defined as a listbox
   */
  const listbox = ref<HTMLElement | null>(null)

  /**
   * Flag to set focus on next render completion, when menu was blurred on click on option
   */
  const callFocus = ref<boolean>(false)

  const activeOptionValue = computed(
    () => optionValues.value[activeIndex.value]
  )

  /**
   * The element of the active option
   */
  const activeOption = computed(
    () => optionRefs[activeOptionValue.value]?.value || null
  )

  const isListboxScrollable = computed(
    () =>
      expanded.value &&
      optionValues.value.length &&
      !!listbox.value &&
      listbox.value.clientHeight < listbox.value.scrollHeight
  )

  const firstIndex = computed(() => {
    let firstIndex = 0

    if (!disabledOptions) {
      return firstIndex
    }

    let firstIsDisabled = true

    while (firstIsDisabled && firstIndex < optionValues.value.length) {
      firstIsDisabled = disabledOptions.value.includes(
        optionValues.value[firstIndex]
      )

      if (firstIsDisabled) {
        firstIndex++
      }
    }

    return firstIndex
  })

  const lastIndex = computed(() => {
    let lastIndex = optionValues.value.length - 1

    if (!disabledOptions) {
      return lastIndex
    }

    let lastIsDisabled = true

    while (lastIsDisabled && lastIndex >= 0) {
      lastIsDisabled = disabledOptions.value.includes(
        optionValues.value[lastIndex]
      )

      if (lastIsDisabled) {
        lastIndex--
      }
    }

    return lastIndex
  })

  const nextIndex = computed(() => {
    let nextIndex = activeIndex.value + 1

    if (!disabledOptions) {
      return nextIndex
    }

    let nextIsDisabled = true

    while (nextIsDisabled && nextIndex < optionValues.value.length) {
      nextIsDisabled = disabledOptions.value.includes(
        optionValues.value[nextIndex]
      )

      if (nextIsDisabled) {
        nextIndex++
      }
    }

    return nextIndex
  })

  const prevIndex = computed(() => {
    let prevIndex = activeIndex.value - 1

    if (!disabledOptions) {
      return prevIndex
    }

    let prevIsDisabled = true

    while (prevIsDisabled && prevIndex >= 0) {
      prevIsDisabled = disabledOptions.value.includes(
        optionValues.value[prevIndex]
      )

      if (prevIsDisabled) {
        prevIndex--
      }
    }

    return prevIndex
  })

  watch(optionValues, () => changeActiveIndex(firstIndex.value), { deep: true })

  watch(expanded, _expanded => {
    // As Vue2 removes attribute when set to a falsy value, it can not directly binded in the template
    expandableElement.value?.setAttribute('aria-expanded', _expanded.toString())
  })

  function onOpenMenu(e: MouseEvent) {
    e.preventDefault()
    onUpdateMenuState(true)
  }

  function onUpdateMenuState(_expanded: boolean) {
    if (disabled?.value) {
      return
    }
    expanded.value = _expanded
  }

  function onMenuBlur() {
    // Closes the listbox if the blur event is not triggered by an option click
    if (ignoreBlur.value) {
      ignoreBlur.value = false
      return
    }
    onUpdateMenuState(false)
  }

  function onMenuKeyDown(e: KeyboardEvent) {
    preventKeyDefault(e)

    if (!expanded.value) {
      if (e.key === 'ArrowDown') {
        onUpdateMenuState(true)
      }
      return
    }

    // Keyboard interactions on the expanded listbox
    switch (e.key) {
      case 'ArrowDown':
        return changeActiveIndex(nextIndex.value)
      case 'ArrowUp':
        return changeActiveIndex(prevIndex.value)
      case 'End':
        return changeActiveIndex(lastIndex.value)
      case 'Home':
        return changeActiveIndex(firstIndex.value)
      case 'Escape':
        onUpdateMenuState(false)
        e.stopPropagation()
    }
  }

  function changeActiveIndex(newIndex: number) {
    if (newIndex > optionValues.value.length - 1 || newIndex < 0) {
      return
    }
    activeIndex.value = newIndex
  }

  function preventKeyDefault(e: KeyboardEvent) {
    // Prevent form submission even when the listbox is closed
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      return e.preventDefault()
    }

    if (!expanded.value) {
      return
    }
    switch (e.key) {
      case 'ArrowUp':
      case 'End':
      case 'Home':
      case 'Escape':
        return e.preventDefault()
    }
  }

  /**
   * Ensure active option element is within the listbox's visible scroll area
   */
  function maintainActiveOptionScrollVisibility() {
    if (!listbox.value || !activeOption.value) {
      return
    }
    const { offsetHeight, offsetTop } = activeOption.value
    const { offsetHeight: parentOffsetHeight, scrollTop } = listbox.value

    const isAbove = offsetTop < scrollTop
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight

    if (isAbove) {
      listbox.value.scrollTo(0, offsetTop)
    } else if (isBelow) {
      listbox.value.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight)
    }
  }

  onMounted(() => {
    expandableElement.value?.addEventListener('click', onOpenMenu)
    expandableElement.value?.addEventListener('blur', onMenuBlur)
    expandableElement.value?.addEventListener('keydown', onMenuKeyDown)
  })

  onUpdated(() => {
    if (callFocus.value === true) {
      expandableElement.value?.focus()
      callFocus.value = false
    }

    if (isListboxScrollable.value) {
      maintainActiveOptionScrollVisibility()
    }
  })

  onUnmounted(() => {
    expandableElement.value?.removeEventListener('click', onOpenMenu)
    expandableElement.value?.removeEventListener('blur', onMenuBlur)
    expandableElement.value?.removeEventListener('keydown', onMenuKeyDown)
  })

  return {
    expanded,
    ignoreBlur,
    activeIndex,
    activeOption,
    activeOptionValue,
    listbox,
    callFocus
  }
}
