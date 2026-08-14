<template>
  <template v-if="displayedValue">
    <div class="fr-pb-2w">
      <p
        v-if="label"
        class="field-label fr-mb-0"
      >
        {{ label }}&nbsp;:
      </p>
      <p class="field-value fr-mb-0">{{ displayedValue }}</p>
    </div>
  </template>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    label?: string
    defaultValue?: string | undefined
    value: string | number | null | undefined
  }>()

  const displayedValue = computed(() => props.value || props.defaultValue)
</script>
