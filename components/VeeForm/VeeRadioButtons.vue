<template>
  <fieldset
    :id="id"
    class="fr-fieldset"
    :class="{ 'fr-fieldset--error': error }"
    role="group"
    :aria-labelledby="ariaLabelledBy"
  >
    <legend
      :id="legendId"
      class="fr-fieldset__legend--regular fr-fieldset__legend"
    >
      {{ label }}
    </legend>
    <div
      v-for="[optionValue, optionLabel] in options"
      :key="optionValue"
      class="fr-fieldset__element"
      :class="{
        'fr-fieldset__element--inline': !pictos
      }"
    >
      <div
        class="fr-radio-group"
        :class="{ 'fr-radio-rich': pictos }"
      >
        <input
          :id="optionId(optionValue)"
          type="radio"
          :value="optionValue"
          :name="name"
          :checked="optionValue === value"
          @change="onChange"
        />
        <label
          class="fr-label"
          :for="optionId(optionValue)"
        >
          {{ optionLabel }}
        </label>
        <div
          v-if="pictos && optionValue in pictos"
          class="fr-radio-rich__img"
        >
          <AtomPictogram :path="pictos[optionValue]" />
        </div>
      </div>
    </div>
    <div
      v-if="error"
      :id="errorId"
      class="fr-messages-group"
      aria-live="polite"
    >
      <p class="fr-message fr-message--error">{{ error }}</p>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import type { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      options: Options
      pictos?: { [key: string]: string }
    }>(),
    { pictos: undefined }
  )

  // we are using toRefs to create reactive references to `name` and `value` props
  // this is important because vee-validate needs to know if any of these props change
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(() => props.name)

  const {
    handleChange,
    value,
    errorMessage: error
  } = useField(name, undefined, {
    type: 'radio'
  })

  const { id, errorId } = useFormFieldId(name)

  const legendId = computed(() => `${id.value}-legend`)

  const ariaLabelledBy = computed(() =>
    error.value ? `${legendId.value} ${errorId.value}` : legendId.value
  )

  function optionId(optionValue: string) {
    return `${id.value}-${optionValue}`
  }

  function onChange(event: Event) {
    const input = event.target as HTMLInputElement
    handleChange(input.value)
  }
</script>

<style scoped>
  .no-label {
    visibility: hidden;
  }
</style>
