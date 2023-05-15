<!--
  FIXME: VeeToggle is unstable, at least in development mode. When accessing
  directly to page containing a VeeToggle, the component seems to be wrongly initialized leading to a value toggle and validation
  instability.
-->

<template>
  <div class="fr-toggle">
    <input
      :id="id"
      :name="name"
      type="checkbox"
      class="fr-toggle__input"
      :checked="checked"
      :value="true"
      :aria-labelledby="labelledBy"
      @input="handleChange"
    />
    <label
      class="fr-toggle__label"
      :class="{ 'no-label': noLabel }"
      :for="id"
      :data-fr-checked-label="checkedLabel ? 'Activé' : undefined"
      :data-fr-unchecked-label="checkedLabel ? 'Désactivé' : undefined"
    >
      <span v-show="!noLabel">
        {{ label }}
      </span>
    </label>
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
      checkedLabel?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      checkedLabel: true
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

  const { id } = useFormFieldId(props.name)
</script>

<style scoped>
  .fr-toggle__label.no-label {
    padding-left: 0;
  }
</style>
