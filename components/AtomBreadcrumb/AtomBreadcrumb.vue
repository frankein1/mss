<template>
  <div class="fr-pt-2w fr-pb-4w"></div>
</template>

<script setup lang="ts">
  import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
  defineProps<{ links?: DsfrBreadcrumbProps['links'] }>()
</script>
