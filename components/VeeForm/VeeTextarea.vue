<template>
  <div
    class="fr-input-group"
    :class="{ 'fr-input-group--error': error }"
  >
    <label
      class="fr-label"
      :class="[labelIcon]"
      :for="name"
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
        ><slot name="hint"></slot
      ></span>
    </label>
    <textarea
      :id="name"
      ref="input"
      class="fr-input"
      :value="value"
      :class="{ 'fr-input--error': error }"
      :name="name"
      @input="handleChange"
    ></textarea>
    <div
      v-if="error"
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
      required?: boolean
      readonly?: boolean
      hint?: boolean
      labelIcon?: string
    }>(),
    { hint: false, required: false, labelIcon: '', readonly: false }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const { errorMessage: error, value, handleChange } = useField<string>(name)
</script>

<style scoped>
  .large-textarea .fr-input {
    /* Pour agrandir la hauteur d'un textarea - Usage HTML : <AtomTextarea class="large-textarea" */
    height: 30rem;
  }
</style>
