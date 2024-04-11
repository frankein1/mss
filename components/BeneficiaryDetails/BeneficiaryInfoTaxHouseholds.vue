<template>
  <BeneficiaryInfoSection
    title="Foyer fiscal"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoTaxHouseholdsContent :tax-households="taxHouseholds" />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryTaxHousehold } from '~/types/beneficiary'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    taxHouseholds: GetBeneficiaryTaxHousehold
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditTaxHousehold(props.beneficiaryId)
  )
</script>
