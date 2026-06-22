<template>
  <li v-if="socialSupport.supportProgram">
    <span class="information-label"
      >{{ helpRequestFieldLabels.supportProgramId }} :</span
    >
    {{ formatSupportProgramOption(socialSupport.supportProgram).label }}
  </li>
  <li v-if="socialSupport.numeroPegase">
    <span class="information-label"
      >{{ helpRequestFieldLabels.numeroPegase }} :</span
    >
    {{ socialSupport.numeroPegase }}
  </li>
  <li v-if="socialSupport.minister">
    <span class="information-label"
      >{{ helpRequestFieldLabels.minister }} :</span
    >
    {{ formatMinisterName(socialSupport.minister) }}
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
  import { formatMinisterName } from '~/utils/minister'
  import { helpRequestFieldLabels } from '~/client/labels'
  import { formatSupportProgramOption } from '~/utils/beneficiary/formatSupportProgramOption'

  defineProps<{
    socialSupport: SocialSupportDetailData
  }>()
</script>
<style scoped lang="scss">
  li {
    break-inside: avoid-column;
  }
</style>
