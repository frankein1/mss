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
    <div class="fr-input-wrap">
      <input
        :id="id"
        :accept="accept"
        class="fr-input"
        :class="{ 'fr-input--error': error }"
        :name="name"
        type="file"
        :aria-describedby="ariaDescribedby"
        :aria-labelledby="labelledBy"
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
      accept?: string
      label: string
      hint?: string
      noLabel?: boolean
      labelledBy?: string
      required?: boolean
    }>(),
    {
      type: 'text',
      accept: '',
      hint: undefined,
      noLabel: false,
      labelledBy: undefined,
      required: false
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const { errorMessage: error, handleChange } = useField<any>(name)

  const { id, errorId } = useFormFieldId(name)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

  function onChange(event: any) {
    // We want to emit a File from this onchange instead of the field value (that is the default implementation)
    const { files } = event.target
    if (!files) {
      handleChange('')
      return
    }
    const file = files[0] ?? ''
    if (file) {
      ;(file as File & { filename: string }).filename = event.target?.value
    }
    handleChange(file)
  }
</script>
