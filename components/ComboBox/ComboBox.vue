<template>
  <div
    class="combobox-wrapper fr-input-group"
    :class="{ 'fr-select-group--error': error }"
  >
    <label
      :id="LABEL_ID"
      :for="INPUT_ID"
      class="fr-label fr-mb-1w"
      :class="{ 'fr-sr-only': !labelVisible }"
    >
      {{ label }}
    </label>
    <div>
      <slot name="input"><ComboBoxInput /></slot>
      <ul
        v-show="(openList && items.length > 0) || loading"
        :id="LISTBOX_ID"
        class="listbox"
        role="listbox"
        :aria-labelledby="LABEL_ID"
      >
        <AtomLoader
          v-if="loading"
          class="fr-mx-auto fr-my-5v"
        />
        <AtomAlert
          v-if="error"
          :alert-type="AlertType.Error"
          :message="error"
        />
        <slot name="listbox"></slot>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup generic="SelectValue = unknown">
  import { AlertType } from '~/utils/constants/alert'
  import {
    comboBoxInputInjectionKey,
    comboBoxItemInjectionKey,
    Item
  } from './utils'

  const { labelVisible = true } = defineProps<{
    label: string
    labelVisible?: boolean
  }>()

  const emit = defineEmits<{
    select: [value: unknown]
    input: [input: string]
  }>()
  const model = defineModel<SelectValue | null>({ required: false })
  function reset() {
    focusedItemIndex.value = -1
    model.value = null
    // TODO: Should use the input's modelValue instead
    if (inputRef.value) {
      inputRef.value.value = ''
    }
  }
  defineExpose({ reset })

  const items = ref<Item[]>([])
  const inputRef = ref<HTMLInputElement | null>(null)
  const focusedItemIndex = ref<number>(-1)
  const focusableItems = computed(() =>
    items.value.filter(item => !item.disabled)
  )

  const focusedItemId = computed(
    () => focusableItems.value[focusedItemIndex.value]?.id ?? null
  )
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  const LABEL_ID = computed(() => `combobox-label-${useId()}`)
  const INPUT_ID = computed(() => `combobox-input-${useId()}`)
  const LISTBOX_ID = computed(() => `combobox-listbox-${useId()}`)

  const openList = ref(false)
  const activeDescendant = computed(
    () => focusableItems.value[focusedItemIndex.value]?.id
  )

  const registerItem = (item: Item) => {
    items.value.push(item)
  }

  const unregisterItem = (item: Item) => {
    const index = items.value.findIndex(
      registerdItem => registerdItem.id === item.id
    )
    if (index >= 0) {
      items.value.splice(index, 1)
    }
  }

  const handleInput = (event: Event) => {
    // TODO: Improve this, as the input might be managed by the user/developer
    // and thus, not be accessible from here
    focusedItemIndex.value = -1
    const target = event.target as HTMLInputElement
    emit('input', target.value)
  }

  const handleSelect = (item: Item) => {
    openList.value = false
    if (inputRef.value) {
      // TODO: Should use the input's modelValue instead?
      inputRef.value.value = item.label ?? String(item.value)
    }
    model.value = item.value as SelectValue
    emit('select', item.value)
    inputRef.value?.blur()
  }

  const onFocus = () => {
    if (inputRef.value?.value !== '') {
      openList.value = true
    }
    focusedItemIndex.value = -1
  }

  const onBlur = () => {
    openList.value = false
    focusedItemIndex.value = -1
  }

  function handleKeydown(event: KeyboardEvent) {
    openList.value = true
    const itemLength = focusableItems.value.length
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (itemLength > 0) {
          focusedItemIndex.value =
            (focusedItemIndex.value +
              itemLength +
              (event.key === 'ArrowDown' ? 1 : -1)) %
            itemLength
          focusableItems.value[
            focusedItemIndex.value
          ].elementRef?.scrollIntoView({ block: 'nearest' })
        }
        break
      case 'Enter':
      case ' ':
        if (focusedItemIndex.value !== -1) {
          event.preventDefault()
          handleSelect(focusableItems.value[focusedItemIndex.value])
        }
        break
      }
      case 'Escape':
      case 'Tab':
        if (event.key === 'Escape') {
          // By default, ESC clears the input
          // We only want to close the listbox
          event.preventDefault()
        }
        focusedItemIndex.value = -1
        openList.value = false
        break
    }
  }

  provide(comboBoxItemInjectionKey, {
    handleSelect,
    registerItem,
    unregisterItem,
    focusedItemId
  })
  provide(comboBoxInputInjectionKey, {
    'id': INPUT_ID.value,
    'aria-expanded': items.value.length > 0,
    'aria-controls': LISTBOX_ID.value,
    'aria-activedescendant': activeDescendant.value,
    'onKeydown': handleKeydown,
    'onFocus': onFocus,
    'onBlur': onBlur,
    'onInput': handleInput,
    'setRef': (element: HTMLInputElement | null) => {
      inputRef.value = element
    }
  })
</script>

<style lang="scss" scoped>
  /* stylelint-disable no-descending-specificity */
  @use '~/assets/style/variables' as *;

  ul.listbox {
    min-width: 230px;
    width: 100%;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: $shadow-dark;
    z-index: 600;
    position: absolute;
    animation: slide-down 0.15s ease 1;
    max-height: 18.75rem;
    overflow-y: scroll;
    min-height: 1.5rem;
    padding: 4px;
    margin: 0;
  }
</style>
