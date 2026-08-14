<template>
  <BeneficiaryInfoSection
    title="Santé"
    :edit-link="editLink"
  >
    <BeneficiaryInfoHealthContent :health="health" />
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import type { GetBeneficiaryHealth } from '~~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    health: GetBeneficiaryHealth
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditHealth.path(props.beneficiaryId)
  )
</script>
