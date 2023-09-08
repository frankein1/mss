<template>
  <div
    v-if="value"
    class="fr-pb-2w"
  >
    <div class="field-label">{{ label }} :</div>
    <div class="field-value">{{ value }}</div>
  </div>
  <div
    v-else-if="defaultValue"
    class="fr-pb-2w"
  >
    <div class="field-label">{{ label }} :</div>
    <div class="field-value">{{ defaultValue }}</div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    label: string
    defaultValue?: string | undefined
    value: string | number | null | undefined
  }>()
</script>
