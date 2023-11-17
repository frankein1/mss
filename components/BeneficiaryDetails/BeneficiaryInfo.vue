<template>
  <BeneficiaryInfoSection
    id="header"
    title=""
  >
    <BeneficiaryInfoHeader :beneficiary="beneficiary" />
  </BeneficiaryInfoSection>
  <BeneficiaryInfoSection
    v-if="followupTypes.length"
    id="followupTypes"
    title=""
  >
    <BeneficiaryInfoFollowupTypes :followup-types="followupTypes" />
  </BeneficiaryInfoSection>

  <BeneficiaryInfoGeneral
    :beneficiary-id="beneficiary.id"
    :general="beneficiary.general"
  />

  <BeneficiaryInfoTaxHouseholds
    v-if="beneficiary.taxHouseholds"
    :beneficiary-id="beneficiary.id"
    :tax-households="beneficiary.taxHouseholds"
  />

  <BeneficiaryInfoEntourages
    v-if="beneficiary.entourages"
    :beneficiary-id="beneficiary.id"
    :entourages="beneficiary.entourages"
  />

  <BeneficiaryInfoHealth
    v-if="beneficiary.health"
    :beneficiary-id="beneficiary.id"
    :health="beneficiary.health"
  />

  <BeneficiaryInfoOccupationIncome
    v-if="beneficiary.occupationIncome"
    :beneficiary-id="beneficiary.id"
    :occupation-income="beneficiary.occupationIncome"
  />

  <BeneficiaryInfoExternalOrganisations
    v-if="beneficiary.externalOrganisations"
    :beneficiary-id="beneficiary.id"
    :external-organisations="beneficiary.externalOrganisations"
  />
</template>

<script lang="ts" setup>
  import { GetBeneficiaryOutput } from '~/types/beneficiary'
  import { FollowupTypeIdAndName } from '~/types/followupType'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    followupTypes: FollowupTypeIdAndName[]
  }>()
</script>
