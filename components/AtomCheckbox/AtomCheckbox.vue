<template>
  <div class="fr-checkbox-group">
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :checked="checked"
      :value="true"
      :aria-labelledby="labelledBy"
      @input="handleChange"
    />
    <label
      class="fr-label"
      :for="id"
    >
      <span :class="{ 'no-label': noLabel }">
        {{ label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      label: string
      name: string
      noLabel?: boolean
      labelledBy?: string
      checked?: boolean
      handleChange?: (e: Event | unknown, shouldValidate?: boolean) => void
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      checked: false,
      handleChange: () => {}
    }
  )

  const { id } = useFormFieldId(props.name)
</script>

<style scoped>
  .no-label {
    visibility: hidden;
  }
</style>
