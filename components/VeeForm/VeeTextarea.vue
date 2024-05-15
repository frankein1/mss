<template>
  <div
    class="fr-input-group"
    :class="{ 'fr-input-group--error': error }"
  >
    <label
      v-if="!noLabel"
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
        v-if="hasHint"
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
      :disabled
      @input="onInput"
      @change="handleChange"
    ></textarea>
    <div
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
      required?: boolean
      readonly?: boolean
      labelIcon?: string
      noLabel?: boolean
      disabled?: boolean
    }>(),
    {
      required: false,
      labelIcon: '',
      readonly: false,
      noLabel: false,
      disabled: false
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const { errorMessage: error, value, handleChange } = useField<string>(name)

  const slots = useSlots()

  const hasHint = computed(() => slots.hint)

  // Allow to remove the displayed error while the user is typing
  function onInput(event: Event) {
    if (error.value) {
      handleChange(event)
    }
  }
</script>

<style scoped>
  .large-textarea .fr-input {
    /* Pour agrandir la hauteur d'un textarea - Usage HTML : <AtomTextarea class="large-textarea" */
    height: 30rem;
  }
</style>
