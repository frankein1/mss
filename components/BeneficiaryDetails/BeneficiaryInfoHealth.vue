<template>
  <BeneficiaryInfoSection
    title="Santé"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoHealthContent :health="health" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script lang="ts" setup>
  import { GetBeneficiaryHealth } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    health: GetBeneficiaryHealth
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditHealth.path(props.beneficiaryId)
  )
</script>
