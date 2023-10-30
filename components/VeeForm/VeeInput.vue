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
        @input="onInput"
        @change="onChange"
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
      noHint?: boolean
    }>(),
    {
      type: 'text',
      readonly: false,
      hint: undefined,
      placeholder: undefined,
      noLabel: false,
      labelledBy: undefined,
      required: false,
      noHint: false
    }
  )

  const emit = defineEmits<{
    changeValue: [value: string]
  }>()

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const {
    errorMessage: error,
    value: refValue,
    handleChange,
    setValue
  } = useField<string | number | Date>(name)

  const { id, errorId } = useFormFieldId(name)

  const bindedValue = computed(() => formatValue(refValue?.value))

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  const type = computed(() =>
    props.type === 'social-security-number' ? 'text' : props.type
  )

  const hint = computed(() => {
    if (props.noHint) {
      return undefined
    }
    let typeHint = ''
    if (props.type === 'tel') {
      typeHint = 'Format attendu : 01 22 33 44 55'
    }
    if (props.type === 'social-security-number') {
      typeHint =
        'Format attendu : 0 00 00 00 000 000 00. La clé du n° de sécurité sociale est optionnelle.'
    }
    if (props.type === 'email') {
      typeHint = 'Fromat attendu : nom@domaine.fr'
    }
    if (props.hint) {
      return typeHint ? `${typeHint}. ${props.hint}` : props.hint
    }
    return typeHint || undefined
  })

  function formatValue(value: string | Date | number) {
    if (!value) {
      return value
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

  // Allow to remove the displayed error while the user is typing
  function onInput(event: Event) {
    if (error.value) {
      handleChange(event)
    }
  }

  function onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    emit('changeValue', value)
    handleChange(event)
    setValue(formatValue(value))
  }
</script>
