<template>
  <div class="fr-container">
    <div class="section fr-p-4w fr-m-1w">
      <BeneficiaryInfoHeader :beneficiary="beneficiary" />
    </div>
    <div class="section fr-p-4w fr-m-1w">
      <BeneficiaryInfoFollowupTypes :followup-types="followupTypes" />
    </div>
    <div class="section fr-p-4w fr-m-1w">
      <BeneficiaryInfoGeneral :beneficiary="beneficiary" />
    </div>
    <div class="section fr-p-4w fr-m-1w">
      <BeneficiaryInfoTaxHouseholds
        :beneficiary="beneficiary"
        :tax-households="taxHouseholds"
      />
    </div>
    <div class="section fr-p-4w fr-m-1w">
      <BeneficiaryInfoEntourages :entourages="entourages" />
    </div>
    <div class="section fr-p-4w fr-m-1w">Santé</div>
    <div class="section fr-p-4w fr-m-1w">Activité/Revenu</div>
    <div class="section fr-p-4w fr-m-1w">Structures extérieures</div>
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

<style scoped>
  .section {
    border-radius: 8px;
    border: 1px solid #ddd;
    background: white;
  }
</style>
