<template>
  <div class="fr-checkbox-group">
    <input
      :id="name"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :aria-labelledby="labelledBy"
      @input="onInput"
    />
    <label
      class="fr-label"
      :for="name"
    >
      <span :class="{ 'no-label': noLabel }">
        {{ label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      label: string
      noLabel?: boolean
      labelledBy?: string
      name: string
      modelValue?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      modelValue: false
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', checked: boolean): void
  }>()

  function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).checked)
  }
</script>

<style scoped>
  .no-label {
    visibility: hidden;
  }
</style>
