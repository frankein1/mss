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
      :required="required"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="labelledBy"
      :disabled="disabled"
      @change="onChange"
      @input="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      @invalid="onValidate"
    >
      <option
        v-for="[optionValue, optionLabel] in options"
        :key="optionValue"
        :value="optionValue"
        :selected="optionValue === modelValue"
        :disabled="disabledOptions.includes(optionValue)"
      >
        {{ optionLabel }}
      </option>
    </select>
    <input
      v-if="disabled"
      :name="name"
      :aria-describedby="ariaDescribedby"
      :value="modelValue"
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
  import type { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      label: string
      noLabel?: boolean
      labelledBy?: string
      name: string
      required?: boolean
      options: Options
      modelValue?: string | null
      disabled?: boolean
      disabledOptions?: string[]
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      required: false,
      modelValue: '',
      disabled: false,
      disabledOptions: () => []
    }
  )

  const emit = defineEmits<{
    (e: 'changeValue', value: string): void
    (e: 'update:modelValue', value: string): void
  }>()

  const { id, errorId } = useFormFieldId(props.name)

  const error = ref('')

  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )
  const ariaDescribedby = computed(() => (error.value ? errorId : undefined))

  function onChange(event: Event) {
    emit('changeValue', (event.target as HTMLSelectElement).value)
    onValidate(event)
  }

  function onValidate(event: Event) {
    error.value = (event.target as HTMLSelectElement).validationMessage
  }
</script>
