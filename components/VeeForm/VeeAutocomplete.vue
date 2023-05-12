<template>
  <AtomAutocomplete
    :label="label"
    :name="name"
    :search-fn="searchFn"
    :error="error"
    :handle-change="handleChange"
    :value="value"
    :required="required"
    :set-value="setValue"
    @result-selected="$emit('resultSelected', $event)"
  />
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'
  import { Options } from '~/utils/options'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      searchFn: (search: string) => Promise<Options>
      required?: boolean
      value?: string
    }>(),
    {
      required: false,
      value: undefined
    }
  )
  const {
    errorMessage: error,
    value,
    handleChange,
    setValue
  } = useField<string | null>(props.name)

  defineEmits<{
    (e: 'resultSelected', value: string): void
  }>()

  watch(
    () => props.value,
    value => {
      if (!value) return
      setValue(value)
    }
  )
</script>
