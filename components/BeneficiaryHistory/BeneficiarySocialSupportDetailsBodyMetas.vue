<template>
  <li v-if="socialSupport.numeroPegase">
    <span class="information-label"
      >{{ helpRequestFieldLabels.numeroPegase }} :</span
    >
    {{ socialSupport.numeroPegase }}
  </li>
  <li v-if="socialSupport.minister">
    <span class="information-label"
      >{{ helpRequestFieldLabels.ministre }} :</span
    >
    {{ socialSupport.minister.firstName }}
    {{ socialSupport.minister.lastName }} ({{
      socialSupport.minister.function
    }})
  </li>
  <li v-if="socialSupport.dueDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.dueDate }} :</span
    >
    {{ formatDate(socialSupport.dueDate) }}
  </li>
</template>

<script setup lang="ts">
  import type { SocialSupportDetailData } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { helpRequestFieldLabels } from '~/client/labels'

  defineProps<{
    socialSupport: SocialSupportDetailData
  }>()
</script>
<style scoped lang="scss">
  li {
    break-inside: avoid-column;
  }
</style>
