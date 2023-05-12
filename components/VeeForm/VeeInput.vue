<template>
  <AtomInput
    :label="label"
    :name="name"
    :no-label="noLabel"
    :labelled-by="labelledBy"
    :placeholder="placeholder"
    :required="required"
    :type="type"
    :hint="hint"
    :pattern="pattern"
    :step="step"
    :min="min"
    :readonly="readonly"
    :value="bindedValue"
    :error="error"
    :handle-change="handleChange"
    @change-value="$emit('changeValue', formatValue($event))"
  />
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      type?:
        | 'text'
        | 'date'
        | 'number'
        | 'tel'
        | 'email'
        | 'social-security-number'
      readonly?: boolean
      hint?: string
      placeholder?: string
      noLabel?: boolean
      labelledBy?: string
      required?: boolean
      pattern?: string
      step?: string
      min?: number
    }>(),
    {
      type: 'text',
      readonly: false,
      hint: undefined,
      placeholder: undefined,
      noLabel: false,
      labelledBy: undefined,
      required: false,
      pattern: undefined,
      step: undefined,
      min: undefined
    }
  )
  const {
    errorMessage: error,
    value: refValue,
    handleChange
  } = useField<string | number | Date>(props.name)

  defineEmits<{
    (e: 'changeValue', value: string): void
  }>()

  const bindedValue = computed(() => formatValue(refValue?.value))

  function formatValue(value: string | Date | number) {
    if (!value) {
      return ''
    }
    if (props.type === 'date' && value instanceof Date) {
      return formatDate(value as Date, 'YYYY-MM-DD')
    }

    /**
     * Help formatting phone number
     * Checking data allows to prevent adding a whitespace when removing the whitespace
     */
    if (props.type === 'tel' && typeof value === 'string') {
      return value.replace(/\d{2}(?=(\d{1,2}){1,4}$)/g, '$& ')
    }

    /**
     * Help formatting social security number
     * Checking data allows to prevent adding a whitespace when removing the whitespace
     */
    if (props.type === 'social-security-number' && typeof value === 'string') {
      const WHITESPACE_POSITIONS = [1, 4, 7, 10, 14]

      const formattedValue = WHITESPACE_POSITIONS.reduce((val, pos) => {
        if (val.length > pos) {
          return `${val.slice(0, pos)} ${val.slice(pos)}`
        }
        return val
      }, value.replace(/\s/g, ''))

      return formattedValue
    }

    return value
  }
</script>
