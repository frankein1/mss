<template>
  <fieldset
    :id="id"
    class="fr-fieldset"
    role="group"
    :aria-labelledby="legendId"
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
      class="fr-fieldset__element fr-fieldset__element--inline"
    >
      <div class="fr-radio-group">
        <input
          :id="optionId(optionValue)"
          type="radio"
          :value="optionValue"
          :name="name"
          @change="onChange"
        />
        <label
          class="fr-label"
          :for="optionId(optionValue)"
        >
          {{ optionLabel }}
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import type { Options } from '~/utils/options'

  const props = defineProps<{
    name: string
    label: string
    options: Options
  }>()

  // we are using toRefs to create reactive references to `name` and `value` props
  // this is important because vee-validate needs to know if any of these props change
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const { name } = toRefs(props)

  const { handleChange } = useField(name, undefined, {
    type: 'radio'
  })

  const { id } = useFormFieldId(props.name)

  const legendId = `${id}-legend`

  function optionId(optionValue: string) {
    return `${id}-${optionValue}`
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
