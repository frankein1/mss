<!--
  FIXME: VeeCheckbox is unstable, at least in development mode. When accessing
  directly to page containing a VeeCheckbox, the component, or its AtomCheckbox
  child seems to be wrongly initialized leading to a value toggle and validation
  instability.
-->

<template>
  <AtomCheckbox
    :label="label"
    :name="name"
    :no-label="noLabel"
    :labelled-by="labelledBy"
    :checked="checked"
    :handle-change="handleChange"
  />
</template>

<script setup lang="ts">
  import { useField } from 'vee-validate'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      noLabel?: boolean
      labelledBy?: string
    }>(),
    {
      noLabel: false,
      labelledBy: undefined
    }
  )

  // we are using toRefs to create reactive references to `name` and `value` props
  // this is important because vee-validate needs to know if any of these props change
  // https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
  const { name } = toRefs(props)

  const { handleChange, checked } = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: true,
    uncheckedValue: false
  })
</script>

<style scoped>
  .no-label {
    visibility: hidden;
  }
</style>
