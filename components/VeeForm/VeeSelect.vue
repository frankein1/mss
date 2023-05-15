<template>
  <div
    class="fr-select-group"
    :class="{
      'fr-select-group--error': error,
      'fr-select-group--disabled': disabled
    }"
  >
    <label
      v-if="!noLabel"
      class="fr-label"
      :for="id"
    >
      {{ displayLabel }}
    </label>
    <select
      :id="id"
      class="fr-select"
      :class="{ 'fr-select--error': error }"
      :name="name"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="labelledBy"
      :disabled="disabled"
      @change="onChange"
    >
      <option
        v-for="[optionValue, optionLabel] in options"
        :key="optionValue"
        :value="optionValue"
        :selected="optionValue === value"
        :disabled="disabledOptions.includes(optionValue)"
      >
        {{ optionLabel }}
      </option>
    </select>
    <input
      v-if="disabled"
      :name="name"
      :aria-describedby="ariaDescribedby"
      :value="value"
      hidden
    />
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

  const emit = defineEmits<{
    (e: 'changeValue', value: string): void
  }>()

  const {
    errorMessage: error,
    value,
    handleChange
  } = useField<string>(props.name)

  const { id, errorId } = useFormFieldId(props.name)

  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )
  const ariaDescribedby = computed(() => (error.value ? errorId : undefined))

  function onChange(event: Event) {
    emit('changeValue', (event.target as HTMLSelectElement).value)
    handleChange(event)
  }
</script>
