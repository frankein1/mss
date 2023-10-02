<template>
  <BeneficiaryInfoSection title="">
    <BeneficiaryInfoHeader :beneficiary="beneficiary" />
  </BeneficiaryInfoSection>
  <BeneficiaryInfoSection
    v-if="followupTypes.length"
    title=""
  >
    <BeneficiaryInfoFollowupTypes :followup-types="followupTypes" />
  </BeneficiaryInfoSection>

  <BeneficiaryInfoGeneral :beneficiary="beneficiary" />

  <BeneficiaryInfoTaxHouseholds
    :beneficiary="beneficiary"
    :tax-households="taxHouseholds"
  />

  <BeneficiaryInfoEntourages
    :beneficiary="beneficiary"
    :entourages="entourages"
  />

  <BeneficiaryInfoHealth :beneficiary="beneficiary" />

  <BeneficiaryInfoOccupationIncome :beneficiary="beneficiary" />

  <BeneficiaryInfoExternalOrganisations :beneficiary="beneficiary" />
</template>

<script lang="ts" setup>
  import type {
    GetBeneficiaryOutput,
    GetBeneficiaryFollowupTypesOutput
  } from '~/server/trpc/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()
</script>
~/server/trpc/routers
