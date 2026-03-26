<template>
  <StatsFollowup
    :social-support-subject-options="socialSupportSubjectOptions"
    :beneficiaries-cities-options="beneficiariesCitiesOptions"
    :agent-options="agentOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    socialSupportSubjectOptions?: Options
    beneficiariesCitiesOptions?: Options
    agentOptions?: Options
  }>()
</script>
