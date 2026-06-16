<template>
  <StatsFollowup
    :social-support-subject-options="socialSupportSubjectOptions"
    :beneficiaries-cities-options="beneficiariesCitiesOptions"
    :agent-options="agentOptions"
    :support-program-name-options="supportProgramNameOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    socialSupportSubjectOptions?: Options
    beneficiariesCitiesOptions?: Options
    agentOptions?: Options
    supportProgramNameOptions?: Options
  }>()
</script>
