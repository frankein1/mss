<!--
  FIXME: VeeCheckbox is unstable, at least in development mode. When accessing
  directly to page containing a VeeCheckbox, the component seems to be wrongly initialized leading to a value toggle and validation
  instability.
-->

<template>
  <div
    class="fr-checkbox-group"
    :class="{ 'fr-checkbox-group--error': error }"
  >
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :checked="checked"
      :value="true"
      :aria-describedby="ariaDescribedby"
      :aria-labelledby="labelledBy"
      @input="handleChange"
    />
    <label
      class="fr-label"
      :for="id"
    >
      <span :class="{ 'no-label': noLabel }">
        {{ displayLabel }}
      </span>
    </label>
    <div
      v-if="error"
      :id="errorId"
      class="fr-messages-group"
      aria-live="assertive"
    >
      <p class="fr-message fr-message--error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      noLabel?: boolean
      labelledBy?: string
      required?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      required: false
    }
  )

  // we are using toRefs to create reactive references to `name` and `value` props
  // this is important because vee-validate needs to know if any of these props change
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const { name } = toRefs(props)

  const {
    handleChange,
    checked,
    errorMessage: error
  } = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: true,
    uncheckedValue: false
  })

  const { id, errorId } = useFormFieldId(props.name)

  const displayLabel = computed(() =>
    props.required ? `${props.label} *` : props.label
  )
  const ariaDescribedby = computed(() => (error.value ? errorId : undefined))
</script>

<style scoped>
  .no-label {
    visibility: hidden;
  }
</style>
