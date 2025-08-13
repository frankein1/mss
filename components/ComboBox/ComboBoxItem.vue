<template>
  <li
    :id
    class="option"
    role="option"
    :class="{
      focused: focusedItem?.value === value,
      disabled
    }"
    v-on="!disabled ? { click: () => handleSelect(value) } : {}"
  >
    <slot></slot>
  </li>
</template>

<script lang="ts" setup generic="Option extends { disabled?: boolean }">
  import { comboBoxInjectionKey } from './utils'

  const { disabled = false, value } = defineProps<{
    disabled?: boolean
    value: unknown
  }>()

  const id = useId()
  const item = computed(() => ({
    id,
    value,
    disabled
  }))

  const emit = defineEmits<{
    select: [option: Option]
  }>()

  const { handleSelect, registerItem, unregisterItem, focusedItem } = inject(
    comboBoxInjectionKey
  ) ?? {
    handleSelect: () => {},
    registerItem: () => {},
    unregisterItem: () => {}
  }

  onMounted(() => registerItem(item.value))
  onUnmounted(() => unregisterItem(item.value))
</script>

<style lang="scss" scoped>
  /* stylelint-disable no-descending-specificity */
  @use '~/assets/style/variables' as *;
  @use '@gouvfr/dsfr/src/module/media-query' as dsfr-media-query;

  .option {
    margin: 0;
    padding: 0.75rem 1rem;
    box-shadow: 0 17px 0 -16px var(--border-default-grey);

    &:not(.disabled) {
      color: var(--text-action-high-grey);
      cursor: pointer;

      &:hover {
        background-color: var(--background-default-grey-hover);
      }
    }

    &.disabled {
      color: var(--text-mention-grey);
    }

    &.focused {
      outline: dashed 1px rgb(0 0 0 / 100%);
    }

    &:last-child {
      box-shadow: none;
    }
  }
</style>
