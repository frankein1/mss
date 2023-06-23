<template>
  <DsfrBreadcrumb :links="anyLinks" />
</template>

<script setup lang="ts">
  import { DsfrBreadcrumb } from '@gouvminint/vue-dsfr'

  const props = defineProps<{
    links: Array<{
      text: string
      to?: string
    }>
  }>()

  // FIXME: For now, the type of DsfrBreadcrumb links is wrong - See https://github.com/dnum-mi/vue-dsfr/issues/546
  const anyLinks = computed(() => props.links as any)
</script>
