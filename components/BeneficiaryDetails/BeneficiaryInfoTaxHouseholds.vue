<template>
  <BeneficiaryInfoSection
    title="Situation Familiale"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoTaxHouseholdsContent :tax-households="taxHouseholds" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryTaxHousehold } from '~/types/beneficiary'
  import { routes } from '~/utils/routes'

  const props = defineProps<{
    beneficiaryId: string
    taxHouseholds: GetBeneficiaryTaxHousehold
  }>()

  const editLink = computed(() =>
    routes.beneficiary.AppBeneficiaryEditTaxHousehold.path(props.beneficiaryId)
  )
</script>
