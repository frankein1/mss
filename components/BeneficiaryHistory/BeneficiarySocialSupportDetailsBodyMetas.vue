<template>
  <li v-if="socialSupport.numeroPegase">
    <span class="information-label"
      >{{ helpRequestFieldLabels.numeroPegase }} :</span
    >
    {{ socialSupport.numeroPegase }}
  </li>
  <li v-if="socialSupport.ministre">
    <span class="information-label"
      >{{ helpRequestFieldLabels.ministre }} :</span
    >
    {{ ministerKeys.byKey[socialSupport.ministre] }}
  </li>
  <li v-if="socialSupport.dueDate">
    <span class="information-label"
      >{{ helpRequestFieldLabels.dueDate }} :</span
    >
    {{ formatDate(socialSupport.dueDate) }}
  </li>
</template>

<script setup lang="ts">
  import { SocialSupportData } from './types'
  import { formatDate } from '~/utils/formatDate'
  import { ministerKeys } from '~/client/options'
  import { helpRequestFieldLabels } from '~/client/labels'

  defineProps<{
    socialSupport: SocialSupportData
  }>()
</script>
