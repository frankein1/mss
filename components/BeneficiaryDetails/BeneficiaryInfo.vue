<template>
  <div class="fr-container">
    <BeneficiaryInfoSection title="">
      <BeneficiaryInfoHeader :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection title="">
      <BeneficiaryInfoFollowupTypes :followup-types="followupTypes" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection
      title="Informations générales"
      :beneficiary-id="beneficiary.id"
    >
      <BeneficiaryInfoGeneral :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection
      title="Foyer fiscal"
      :beneficiary-id="beneficiary.id"
    >
      <BeneficiaryInfoTaxHouseholds
        :beneficiary="beneficiary"
        :tax-households="taxHouseholds"
      />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection
      title="Entourage"
      :beneficiary-id="beneficiary.id"
    >
      <BeneficiaryInfoEntourages :entourages="entourages" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection
      title="Santé"
      :beneficiary-id="beneficiary.id"
    >
      <BeneficiaryInfoHealth :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection
      title="Activité/Revenu"
      :beneficiary-id="beneficiary.id"
    >
      <BeneficiaryInfoOccupationIncome :beneficiary="beneficiary" />
    </BeneficiaryInfoSection>
    <BeneficiaryInfoSection
      title="Structures extérieures"
      :beneficiary-id="beneficiary.id"
    >
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
