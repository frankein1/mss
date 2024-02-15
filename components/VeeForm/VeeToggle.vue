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
      :for="id"
      :data-fr-checked-label="checkedLabel ? 'Activé' : undefined"
      :data-fr-unchecked-label="checkedLabel ? 'Désactivé' : undefined"
    >
      <span
        class="fr-label"
        :class="{ 'fr-sr-only': noLabel }"
      >
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
  const name = toRef(() => props.name)

  const { handleChange, checked } = useField(name, undefined, {
    type: 'checkbox',
    checkedValue: true,
    uncheckedValue: false
  })

  const { id } = useFormFieldId(name)
</script>

<style scoped>
  .fr-toggle__label.no-label {
    padding-left: 0;
  }
</style>
