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
    :beneficiary-id="beneficiary.id"
    :tax-households="beneficiary.taxHouseholds"
  />

  <BeneficiaryInfoEntourages
    :beneficiary-id="beneficiary.id"
    :entourages="beneficiary.entourages"
  />

  <BeneficiaryInfoHealth
    :beneficiary-id="beneficiary.id"
    :health="beneficiary.health"
    :permissions="permissions"
  />

  <BeneficiaryInfoOccupationIncome
    :beneficiary-id="beneficiary.id"
    :occupation-income="beneficiary.occupationIncome"
  />

  <BeneficiaryInfoExternalOrganisations
    :beneficiary-id="beneficiary.id"
    :external-organisations="beneficiary.externalOrganisations"
  />
</template>

<script lang="ts" setup>
  import { BeneficiaryEditPermission } from '~/server/security'
  import type {
    GetBeneficiaryOutput,
    GetBeneficiaryFollowupTypes
  } from '~/server/route'

  defineProps<{
    beneficiary: GetBeneficiaryOutput
    followupTypes: GetBeneficiaryFollowupTypes
    permissions: BeneficiaryEditPermission
  }>()
</script>
