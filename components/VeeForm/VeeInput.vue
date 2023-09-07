<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': error,
      'fr-input-group--disabled': readonly
    }"
  >
    <label
      v-if="!noLabel"
      class="fr-label"
      :for="id"
    >
      {{ label }}
      <span
        v-if="required"
        class="color-red"
        >*</span
      >
      <span
        v-if="hint"
        class="fr-hint-text"
      >
        {{ hint }}
      </span>
    </label>
    <div
      class="fr-input-wrap"
      :class="{ 'fr-icon-calendar-line': type === 'date' }"
    >
      <input
        :id="id"
        ref="input"
        class="fr-input"
        :class="{ 'fr-input--error': error }"
        :name="name"
        :placeholder="placeholder"
        :type="type"
        :aria-describedby="ariaDescribedby"
        :aria-labelledby="labelledBy"
        :readonly="readonly"
        :value="bindedValue"
        @input="onChange"
      />
    </div>
    <div
      v-if="error"
      :id="errorId"
      class="fr-messages-group"
      aria-live="polite"
    >
      <p class="fr-message fr-message--error">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      type?:
        | 'text'
        | 'password'
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

  const emit = defineEmits<{
    changeValue: [value: string]
  }>()

  const {
    errorMessage: error,
    value: refValue,
    handleChange
  } = useField<string | number | Date>(props.name)

  const { id, errorId } = useFormFieldId(props.name)

  const bindedValue = computed(() => formatValue(refValue?.value))

  const ariaDescribedby = computed(() => (error.value ? errorId : undefined))

  const placeholder = computed(() => {
    if (props.placeholder) {
      return props.placeholder
    }
    if (props.type === 'tel') {
      return '00 00 00 00 00'
    }
    if (props.type === 'social-security-number') {
      return '0 00 00 00 000 000 00'
    }
    return undefined
  })

  const type = computed(() =>
    props.type === 'social-security-number' ? 'text' : props.type
  )

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
      const WHITESPACE_POSITIONS = [1, 4, 7, 10, 14, 18]

      const formattedValue = WHITESPACE_POSITIONS.reduce(
        (val, pos) => {
          if (val.length > pos) {
            return `${val.slice(0, pos)} ${val.slice(pos)}`
          }
          return val
        },
        value.replace(/\s/g, '')
      )

      return formattedValue
    }

    return value
  }

  function onChange(event: Event) {
    emit('changeValue', (event.target as HTMLInputElement).value)
    handleChange(event)
  }
</script>
