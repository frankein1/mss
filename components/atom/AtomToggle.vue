<template>
  <div class="fr-toggle">
    <input
      :id="name"
      type="checkbox"
      class="fr-toggle__input"
      :checked="checked"
      :aria-labelledby="labelledBy"
      @change="$emit('toggle', ($event.target as HTMLInputElement).checked)"
    />
    <label
      class="fr-toggle__label"
      :class="{ 'no-label': noLabel }"
      :for="name"
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
  withDefaults(
    defineProps<{
      label: string
      noLabel?: boolean
      labelledBy?: string
      name: string
      checked?: boolean
      checkedLabel?: boolean
    }>(),
    {
      noLabel: false,
      labelledBy: undefined,
      checked: false,
      checkedLabel: true
    }
  )

  defineEmits<{
    (e: 'toggle', checked: boolean): void
  }>()
</script>

<style scoped>
  .fr-toggle__label.no-label {
    padding-left: 0;
  }
</style>
