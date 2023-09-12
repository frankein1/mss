<template>
  <div class="fr-container">
    <BeneficiaryInfoSection title="">
      <BeneficiaryInfoHeader :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="">
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

    <BeneficiaryInfoOtherInformation :beneficiary="beneficiary" />
  </div>
</template>

<script lang="ts" setup>
  import type {
    GetBeneficiaryOutput,
    GetBeneficiaryFollowupTypesOutput
  } from '~/server/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()
</script>
