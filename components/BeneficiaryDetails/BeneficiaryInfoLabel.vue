<template>
  <div
    v-if="displayedValue"
    class="fr-pb-2w"
  >
    <div class="field-label">{{ label }} :</div>
    <div class="field-value">{{ displayedValue }}</div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    label: string
    defaultValue?: string | undefined
    value: string | number | null | undefined
  }>()

  const displayedValue = computed(() => props.value || props.defaultValue)
</script>
