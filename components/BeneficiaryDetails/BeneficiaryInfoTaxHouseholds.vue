<template>
  <BeneficiaryInfoSection
    v-if="taxHouseholds && taxHouseholds.taxHouseholds?.length"
    title="Foyer fiscal"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoTaxHouseholdsContent
        :beneficiary-id="beneficiaryId"
        :tax-households="taxHouseholds"
      />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import type { GetBeneficiaryTaxHousehold } from '~/server/route'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiaryId: string
    taxHouseholds?: GetBeneficiaryTaxHousehold
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditTaxHousehold(props.beneficiaryId)
  )
</script>
