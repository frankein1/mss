<template>
  <input
    :id="id"
    type="checkbox"
    :name="option.value"
    :label="option.label"
    :checked
    :disabled
    @change="onchange(option)"
  />
  <label
    class="fr-label"
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
  }>()

  const onchange = (value: OptionType) => {
    emit('changeValue', value)
  }
</script>

<style lang="scss" scoped>
  label {
    margin-left: 0;
  }
  label:before {
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
    border-width: 1px;
    border: 1px solid var(--primary);
    flex-shrink: 0;
    padding: 0;
    user-select: none;
    vertical-align: middle;
    border-radius: 0.25rem;
  }

  [type='checkbox']:checked {
    background-color: currentColor;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-color: #0000;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 16 16'%3E%3Cpath d='M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0'/%3E%3C/svg%3E");
  }
  [type='checkbox']:disabled {
    border-color: var(--text-disabled-grey);
  }
</style>
