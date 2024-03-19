<template>
  <VeeCheckbox
    class="fr-mb-2w"
    :label="label"
    :name="`checkbox-add-${id}`"
  />
</template>

<script lang="ts" setup>
  defineProps<{
    id: string
    label: string
  }>()

  defineEmits<{
    toggle: []
  }>()
</script>

<style></style>
