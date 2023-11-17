<template>
  <div
    class="fr-input-group fr-search-bar"
    :class="{
      'fr-input-group--error': error
    }"
  >
    <label
      class="fr-label fr-hidden"
      :for="id"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      ref="input"
      class="fr-input"
      :class="{ 'fr-input--error': error }"
      :name="name"
      :placeholder="placeholder"
      type="text"
      :aria-describedby="ariaDescribedby"
      @input="onInput"
      @change="onChange"
    />
    <div
      class="fr-btn search-btn"
      :title="label"
    ></div>
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
      placeholder?: string
    }>(),
    {
      placeholder: undefined
    }
  )

  const emit = defineEmits<{
    changeValue: [value: string]
  }>()

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const { errorMessage: error, handleChange } = useField<
    string | number | Date
  >(name)

  const { id, errorId } = useFormFieldId(name)

  const ariaDescribedby = computed(() =>
    error.value ? errorId.value : undefined
  )

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
  }
</script>
