<template>
  <li
    :id
    ref="combobox-item"
    class="option"
    role="option"
    :class="{
      focused: isFocused,
      disabled
    }"
    v-on="!disabled ? { click: () => handleSelect(item) } : {}"
    @mousedown.prevent
  >
    <slot></slot>
  </li>
</template>

<script lang="ts" setup>
  import { comboBoxItemInjectionKey, Item } from './utils'

  const {
    disabled = false,
    value,
    label
  } = defineProps<{
    label?: string
    disabled?: boolean
    value: unknown
  }>()

  const elementRef = useTemplateRef<HTMLLIElement>('combobox-item')

  const id = useId()
  const item = computed<Item>(() => ({
    id,
    label: label ?? elementRef.value?.textContent,
    value,
    disabled,
    elementRef: elementRef.value
  }))

  const { handleSelect, registerItem, unregisterItem, focusedItemId } = inject(
    comboBoxItemInjectionKey,
    {
      handleSelect: () => {},
      registerItem: () => {},
      unregisterItem: () => {},
      focusedItemId: ref(null)
    }
  )
  const isFocused = computed(() => focusedItemId.value === id)
  onMounted(() => registerItem(item.value))
  onUnmounted(() => unregisterItem(item.value))
</script>

<style lang="scss" scoped>
  .option {
    margin: 0;
    color: var(--text-action-high-grey);
    cursor: pointer;
    padding: 0.75rem 1rem;
    box-shadow: 0 17px 0 -16px var(--border-default-grey);

    &.disabled {
      cursor: default;
      color: var(--text-mention-grey);
    }

    &.focused {
      outline: dashed 1px rgb(0 0 0 / 100%);
    }

    &:last-child {
      box-shadow: none;
    }

    &:not(.disabled):hover {
      background-color: var(--background-default-grey-hover);
    }
  }
</style>
