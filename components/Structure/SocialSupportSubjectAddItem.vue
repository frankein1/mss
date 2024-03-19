<template>
  <VeeCheckbox
    class="fr-mb-2w"
    :label="label"
    :name="name"
  />
</template>

<script lang="ts" setup>
  defineProps<{
    label: string
    name: string
  }>()
</script>
