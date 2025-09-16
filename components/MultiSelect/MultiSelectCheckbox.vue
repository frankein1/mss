<template>
  <input
    :id="id"
    type="checkbox"
    class="input-checkbox"
    :name="option.value"
    :label="option.label"
    :checked
    :disabled
    @change="onchange(option)"
    @keydown.prevent.space="onchange(option)"
    @keydown.prevent.down="emit('handleKeyDown')"
    @keydown.prevent.up="emit('handleKeyUp')"
  />
  <label
    class="fr-label"
    :class="{ 'label-disabled': disabled }"
    :for="option.value"
    >{{ option.label }}</label
  >
</template>

<script setup lang="ts">
  import type { OptionType } from '~/utils/options'

  defineProps<{
    id: string
    option: OptionType
    checked: boolean
    disabled: boolean
  }>()

  const emit = defineEmits<{
    changeValue: [value: OptionType]
    handleKeyUp: []
    handleKeyDown: []
  }>()

  const onchange = (value: OptionType) => {
    emit('changeValue', value)
  }
</script>

<style lang="scss" scoped>
  label {
    margin-left: 0;
    color: var(--text-label-grey) !important;
  }

  label.label-disabled {
    color: var(--text-disabled-grey) !important;
  }

  label::before {
    top: 0.3rem;
    width: 1rem;
    height: 1rem;
    left: -1.5rem;
  }

  [type='checkbox'] {
    display: inline-block;
    appearance: none;
    color: var(--primary);
    background-color: #fff;
    background-origin: border-box;
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--primary);
    flex-shrink: 0;
    padding: 0;
    user-select: none;
    vertical-align: middle;
    border-radius: 0.25rem;
    transform: translate(0, 0.25rem);
  }

  [type='checkbox']:checked {
    background-color: currentcolor;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 68% 68%;
    border-color: #0000;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23F5F5FE' width='12' height='9' viewBox='0 0 12 9'%3E%3Cpath d='M4.66674 7.11304L10.7947 0.984375L11.7381 1.92704L4.66674 8.99837L0.424072 4.75571L1.36674 3.81304L4.66674 7.11304Z'/%3E%3C/svg%3E");
  }

  [type='checkbox']:disabled {
    border-color: var(--text-disabled-grey);
  }
</style>
