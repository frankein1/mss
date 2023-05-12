<template>
  <AtomSelect
    :label="label"
    :name="name"
    :options="options"
    :required="required"
    :value="value"
    :handle-change="handleChange"
    :error="error"
    :disabled="disabled"
    :no-label="noLabel"
    :labelled-by="labelledBy"
    @change-value="$emit('changeValue', $event)"
  />
</template>

<script lang="ts" setup>
  import { useField } from 'vee-validate'
  import type { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      options: Options
      required?: boolean
      noLabel?: boolean
      labelledBy?: string
      disabled?: boolean
      disabledOptions?: string[]
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      disabled: false,
      disabledOptions: () => [],
      required: false
    }
  )

  defineEmits<{
    (e: 'changeValue', value: string): void
  }>()

  const {
    errorMessage: error,
    value,
    handleChange
  } = useField<string>(props.name)
</script>
