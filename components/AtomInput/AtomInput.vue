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
        :value="value"
        @input="onChange"
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
  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      value?: string | number | Date | null
      handleChange?: (e: Event | unknown, shouldValidate?: boolean) => void
      error?: string
      noLabel?: boolean
      labelledBy?: string
      placeholder?: string
      required?: boolean
      type?: string
      hint?: string
      readonly?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      placeholder: undefined,
      required: false,
      type: 'text',
      hint: undefined,
      value: '',
      handleChange: () => {},
      error: undefined,
      readonly: false
    }
  )

  const emit = defineEmits<{
    (e: 'changeValue', value: string): void
  }>()

  const { id, errorId } = useFormFieldId(props.name)

  const input = ref<HTMLInputElement | null>(null)

  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )
  const ariaDescribedby = computed(() => (props.error ? errorId : undefined))

  const placeholder = computed(() => {
    if (props.placeholder) return props.placeholder
    if (props.type === 'tel') return '00 00 00 00 00'
    if (props.type === 'social-security-number') {
      return '0 00 00 00 000 000'
    }
    return undefined
  })

  const type = computed(() =>
    props.type === 'social-security-number' ? 'text' : props.type
  )

  function onChange(event: Event) {
    emit('changeValue', (event.target as HTMLSelectElement).value)
    props.handleChange(event)
  }
</script>
