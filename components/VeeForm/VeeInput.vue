<template>
  <div
    class="fr-input-group"
    :class="{
      'fr-input-group--error': error
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
        :value="bindedValue"
        @input="onInput"
        @change="onChange"
        @blur="onBlur"
      />
    </div>
    <div
      :id="errorId"
      class="fr-messages-group"
      aria-live="polite"
    >
      <p
        v-if="error"
        class="fr-message fr-message--error"
      >
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
      hint?: string
      placeholder?: string
      noLabel?: boolean
      labelledBy?: string
      required?: boolean
      noHint?: boolean
    }>(),
    {
      type: 'text',
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
    changeInput: [value: string]
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
      typeHint = 'Format attendu : (+33) 1 22 33 44 55'
    }
    if (props.type === 'social-security-number') {
      typeHint =
        'Format attendu : 0 00 00 00 000 000 00. La clé du n° de sécurité sociale est optionnelle.'
    }
    if (props.type === 'email') {
      typeHint = 'Format attendu : nom@domaine.fr'
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
      return formatPhone(value)
    }

    /**
     * Help formatting social security number
     * Checking data allows to prevent adding a whitespace when removing the whitespace
     */
    if (props.type === 'social-security-number' && typeof value === 'string') {
      return formatSocialSecurityNumber(value)
    }

    return value
  }

  function formatPhone(value: string) {
    if (
      value.match(
        /(^(\+33 [1-9]|0[1-9])( \d\d){4}$)|(^(\+\d\d(?<!\+33)) ?[1-9]( ?\d){6,14}$)/g
      )
    ) {
      return value
    }

    let telValue = value.replace(/ /g, '')

    if (telValue.match(/^\+33([1-9])((\d){8})$/g)) {
      telValue = telValue.replace(/^\+33([1-9])((\d){8})$/g, '+33 $1 $2')
    }

    return telValue.replace(/\d{2}(?=(\d{1,2}){1,4}$)/g, '$& ')
  }

  function formatSocialSecurityNumber(value: string) {
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

  // Allow to remove the displayed error while the user is typing
  function onInput(event: Event) {
    if (error.value) {
      handleChange(event)
    }
    const value = (event.target as HTMLInputElement).value
    emit('changeInput', value)
  }

  /**
   * Date fields are handled differently to prevent change when change event is
   * triggered.
   * Indeed, in such inputs, the event is trigger while the user is moving from
   * one date part (day, month or year) to another which can lead to weird
   * behavior. Instead, change is only handled on blur.
   */
  function onChange(event: Event) {
    if (type.value === 'date') {
      return
    }
    change(event)
  }

  function onBlur(event: Event) {
    if (type.value !== 'date') {
      return
    }
    change(event)
  }

  function change(event: Event) {
    const value = (event.target as HTMLInputElement).value
    emit('changeValue', value)
    handleChange(event)
    setValue(formatValue(value))
  }
</script>

<style scoped>
  .fr-input[type='number'] {
    text-align: right;
    padding-right: 0.7rem;
  }
</style>
