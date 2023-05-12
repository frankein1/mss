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

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      label: string
      noLabel?: boolean
      labelledBy?: string
      name: string
      checked?: boolean
      checkedLabel?: boolean
      handleChange?: (e: Event | unknown, shouldValidate?: boolean) => void
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      checked: false,
      checkedLabel: true,
      handleChange: () => {}
    }
  )

  const { id } = useFormFieldId(props.name)
</script>

<style scoped>
  .fr-toggle__label.no-label {
    padding-left: 0;
  }
</style>
