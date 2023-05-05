<template>
  <div class="fr-checkbox-group">
    <input
      :id="id"
      type="checkbox"
      :name="name"
      :checked="!!modelValue"
      :aria-labelledby="labelledBy"
      @input="onInput"
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
      noLabel?: boolean
      labelledBy?: string
      name: string
      modelValue?: boolean | null
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

  const { id } = useFormFieldId(props.name)

  function onInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).checked)
  }
</script>

<style scoped>
  .no-label {
    visibility: hidden;
  }
</style>
