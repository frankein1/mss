<template>
  <div class="fr-container--fluid">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-lg-6 beneficiary-details-col">
        <BeneficiaryDetailsGeneral :beneficiary="beneficiary" />
        <BeneficiaryDetailsHealth :beneficiary="beneficiary" />
        <BeneficiaryDetailsOccupationIncome :beneficiary="beneficiary" />
        <BeneficiaryDetailsRelatives
          v-if="canAccessRelatives && houseHoldSection"
          :beneficiary="beneficiary"
          :relatives="taxHouseholds"
          household
        />
        <BeneficiaryDetailsRelatives
          v-if="canAccessRelatives && entourages?.length"
          :beneficiary="beneficiary"
          :relatives="entourages"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Beneficiary } from '@prisma/client'
  import { BeneficiaryRelativeWithBeneficiary } from './types'
  import { useAuthStore } from '~/store/auth'

  const props = defineProps<{
    beneficiary: Beneficiary
    taxHouseholds: BeneficiaryRelativeWithBeneficiary[]
    entourages: BeneficiaryRelativeWithBeneficiary[]
  }>()

  const authStore = useAuthStore()

  const canAccessRelatives = computed(() => !authStore.isAgentDAccueil)

  const houseHoldSection = computed(
    () =>
      props.taxHouseholds.length ||
      props.beneficiary.familySituation ||
      props.beneficiary.minorChildren ||
      props.beneficiary.majorChildren
  )
</script>
