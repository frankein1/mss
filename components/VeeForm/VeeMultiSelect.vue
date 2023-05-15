<template>
  <AtomMultiSelect
    :label="label"
    :options="options"
    :label-class="labelClass"
    :required="required"
    :name="name"
    :dropdown="dropdown"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :disabled-options="disabledOptions"
    :hint="hint"
    :value="value"
    :handle-change="handleChange"
    :error="error"
    @change-value="$emit('changeValue', $event)"
  />
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import { toRef } from 'vue'

  const props = withDefaults(
    defineProps<{
      label: string
      options: Map<string, string>
      labelClass?: string
      required?: boolean
      name: string
      dropdown?: boolean
      placeholder?: string
      disabled?: boolean
      readonly?: boolean
      disabledOptions?: string[]
      hint?: string
    }>(),
    {
      labelClass: '',
      required: false,
      dropdown: false,
      placeholder: '',
      disabled: false,
      readonly: false,
      disabledOptions: () => [],
      hint: ''
    }
  )

  // use `toRef` to create reactive references to `name` prop which is passed to `useField`
  // this is important because vee-validte needs to know if the field name changes
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const name = toRef(props, 'name')

  defineEmits<{
    (e: 'changeValue', value: string[]): void
  }>()

  // we don't provide any rules here because we are using form-level validation
  // https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
  const {
    value,
    handleChange,
    errorMessage: error
  } = useField<string[]>(name, undefined)
</script>
