<template>
  <div class="fr-p-3v">
    <BeneficiaryFormFileInformation
      :agents="agents"
      :beneficiary="beneficiary"
      :can-set-referents="canSetReferents"
    />
    <h2 class="title-blue fr-grid-row fr-grid-row--gutters fr-mb-3w">
      Informations générales
    </h2>
    <BeneficiaryFormIdentity />
    <BeneficiaryFormContactDetails />
    <BeneficiaryFormAddress />
  </div>
</template>

<script setup lang="ts">
  import { SaveBeneficiaryGeneralInformationInput } from '~/server/schema'
  import { BeneficiaryReferent } from '~/types/beneficiary'

  withDefaults(
    defineProps<{
      beneficiary?: SaveBeneficiaryGeneralInformationInput
      agents: BeneficiaryReferent[]
      canSetReferents?: boolean
    }>(),
    { beneficiary: undefined, canSetReferents: true }
  )
</script>
