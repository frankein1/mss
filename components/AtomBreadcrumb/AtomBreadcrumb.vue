<template>
  <div
    v-if="!links"
    class="fr-pt-2w fr-pb-4w"
  ></div>
  <DsfrBreadcrumb
    v-else
    :links
  />
</template>

<script setup lang="ts">
  import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
  defineProps<{ links?: DsfrBreadcrumbProps['links'] }>()
</script>
