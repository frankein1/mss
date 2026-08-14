<template>
  <StatsHelpRequest
    :social-support-subject-options="socialSupportSubjectOptions"
    :beneficiaries-cities-options="beneficiariesCitiesOptions"
    :beneficiaries-schools-options="beneficiariesSchoolsOptions"
    :agent-options="agentOptions"
  />
</template>

<script lang="ts" setup>
  import type { Options } from '~/utils/options'

  defineProps<{
    socialSupportSubjectOptions?: Options
    beneficiariesCitiesOptions?: Options
    beneficiariesSchoolsOptions?: Options
    agentOptions?: Options
  }>()
</script>
