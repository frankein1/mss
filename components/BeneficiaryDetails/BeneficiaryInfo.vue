<template>
  <div class="fr-container">
    <BeneficiaryInfoSection title="">
      <BeneficiaryInfoHeader :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="">
      <BeneficiaryInfoFollowupTypes :followup-types="followupTypes" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="Informations générales">
      <BeneficiaryInfoGeneral :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="Foyer fiscal">
      <BeneficiaryInfoTaxHouseholds
        :beneficiary="beneficiary"
        :tax-households="taxHouseholds"
      />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="Entourage">
      <BeneficiaryInfoEntourages :entourages="entourages" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="Santé">
      <BeneficiaryInfoHealth :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="Activité/Revenu">
      <BeneficiaryInfoOccupationIncome :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="Structures extérieures">
      <BeneficiaryInfoOtherInformation :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
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
