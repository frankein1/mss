<template>
  <BeneficiaryInfoSection
    v-if="hasTaxHouseholdsInfo"
    id="taxHouseholds"
    title="Foyer fiscal"
    :edit-link="editLink"
  >
    <div class="fr-container">
      <BeneficiaryInfoTaxHouseholdsContent
        :beneficiary="beneficiary"
        :tax-households="taxHouseholds"
      />
    </div>
  </BeneficiaryInfoSection>
</template>

<script setup lang="ts">
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import type { GetBeneficiaryOutput } from '~/server/trpc/routers'
  import { RoutePath } from '~/utils/routing'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
  }>()

  const editLink = computed(() =>
    RoutePath.AppBeneficiaryEditTaxHousehold(props.beneficiary.id)
  )

  const hasTaxHouseholdsInfo = computed(
    () =>
      props.taxHouseholds?.length > 0 ||
      props.beneficiary.familySituation ||
      props.beneficiary.minorChildren ||
      props.beneficiary.majorChildren
  )
</script>
