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
      :for="name"
    >
      {{ displayLabel }}
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
        :id="name"
        ref="input"
        v-model="modelValue"
        class="fr-input"
        :class="{ 'fr-input--error': error }"
        :name="name"
        :placeholder="placeholder"
        :type="type"
        :required="required"
        :pattern="pattern"
        :autocomplete="autocomplete ? 'on' : 'off'"
        :aria-describedby="ariaDescribedby"
        :aria-labelledby="labelledBy"
        :step="step"
        :min="min"
        :readonly="readonly"
        @input="onInput"
        @change="
          $emit('changeValue', ($event.target as HTMLInputElement).value)
        "
        @invalid="onValidate"
      />
    </div>
    <div
      v-if="error"
      :id="errorId"
      class="fr-messages-group"
      aria-live="assertive"
    >
      <p class="fr-message fr-message--error">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      label: string
      noLabel?: boolean
      labelledBy?: string
      name: string
      placeholder?: string
      required?: boolean
      type?: string
      autocomplete?: boolean
      hint?: string
      pattern?: string
      customError?: string
      value?: string | number | Date
      step?: string
      min?: number
      readonly?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      placeholder: undefined,
      required: false,
      type: 'text',
      autocomplete: false,
      hint: undefined,
      pattern: undefined,
      customError: '',
      value: '',
      step: undefined,
      min: undefined,
      readonly: false
    }
  )

  defineEmits<{
    (e: 'changeValue', value: string): void
  }>()

  const error = ref('')

  // This model is only used to prevent input value from being replace by initial value when custom error state changes
  const modelValue = ref(props.value)

  const input = ref<HTMLInputElement | null>(null)

  const errorId = computed(() => `${props.name}-error-desc-error`)
  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )
  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  const placeholder = computed(() => {
    if (props.placeholder) return props.placeholder
    if (props.type === 'tel') return '00 00 00 00 00'
    if (props.type === 'social-security-number') {
      return '0 00 00 00 000 000'
    }
    return undefined
  })

  const pattern = computed(() => {
    if (props.pattern) return props.pattern
    if (props.type === 'tel') return '^(\\d{2} ){4}\\d{2}$'
    if (props.type === 'social-security-number') {
      return '^[12] \\d{2} (0[1-9]|1[0-2]) (2[AB]|\\d{2}) \\d{3} \\d{3}$'
    }
    return undefined
  })

  const type = computed(() =>
    props.type === 'social-security-number' ? 'text' : props.type
  )

  watch(
    () => props.value,
    value => {
      modelValue.value = value
    }
  )

  watch(
    () => props.customError,
    customError => {
      // Custom error should be updated on form submit
      input.value?.setCustomValidity(customError)
      input.value?.reportValidity()
    }
  )

  function onInput(event: Event) {
    /**
     * Help formatting phone number
     * Checking data allows to prevent adding a whitespace when removing the whitespace
     */
    if (props.type === 'tel' && (event as InputEvent).data) {
      modelValue.value = (modelValue.value as string).replace(
        /\d{2}(?=(\d{1,2}){1,4}$)/g,
        '$& '
      )
    }

    /**
     * Help formatting social security number
     * Checking data allows to prevent adding a whitespace when removing the whitespace
     */
    if (props.type === 'social-security-number' && (event as InputEvent).data) {
      const WHITESPACE_POSITIONS = [1, 4, 7, 10, 14]

      const formattedValue = WHITESPACE_POSITIONS.reduce((val, pos) => {
        if (val.length > pos) {
          return `${val.slice(0, pos)} ${val.slice(pos)}`
        }
        return val
      }, (modelValue.value as string).replace(/\s/g, ''))

      modelValue.value = formattedValue
    }

    onValidate(event)
  }

  function onValidate(event: Event) {
    error.value = (event.target as HTMLInputElement).validationMessage
  }
</script>
