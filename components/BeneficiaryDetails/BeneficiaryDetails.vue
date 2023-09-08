<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <BeneficiaryDetailsDefault :beneficiary="beneficiary" />
        <BeneficiaryDetailsFollowupTypes
          v-if="
            followupTypes.legallyRequired.length ||
            followupTypes.legallyNotRequired.length
          "
          :followup-types="followupTypes"
        />
        <!-- TODO: "Informations générales" title and accordion feature -->
        <BeneficiaryDetailsGeneral
          v-if="hasGeneralInformationsSection"
          :beneficiary="beneficiary"
        />
        <!-- TODO: continue adding informations components -->
        <!-- <BeneficiaryDetailsHealth :beneficiary="beneficiary" />
        <BeneficiaryDetailsOccupationIncome :beneficiary="beneficiary" />
        <BeneficiaryDetailsRelatives
          v-if="houseHoldSection"
          :beneficiary="beneficiary"
          :relatives="taxHouseholds"
          household
        />
        <BeneficiaryDetailsRelatives
          v-if="entourages.length"
          :beneficiary="beneficiary"
          :relatives="entourages"
        />
        <BeneficiaryDetailsOtherInformation :beneficiary="beneficiary" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type {
    GetBeneficiaryOutput,
    GetBeneficiaryFollowupTypesOutput
  } from '~/server/routers'
  import { BeneficiaryRelativeWithLinkedBeneficiary } from '~/types/relative'
  import { hasGeneralInformations } from '~/utils/beneficiary'

  const props = defineProps<{
    beneficiary: GetBeneficiaryOutput
    taxHouseholds: BeneficiaryRelativeWithLinkedBeneficiary[]
    entourages: BeneficiaryRelativeWithLinkedBeneficiary[]
    followupTypes: GetBeneficiaryFollowupTypesOutput
  }>()

  const hasGeneralInformationsSection = computed(() =>
    hasGeneralInformations(props.beneficiary)
  )

  // const houseHoldSection = computed(
  //   () =>
  //     props.taxHouseholds.length ||
  //     props.beneficiary.familySituation ||
  //     props.beneficiary.minorChildren ||
  //     props.beneficiary.majorChildren
  // )
</script>
