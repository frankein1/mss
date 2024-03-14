<template>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.socioProfessionalCategory"
      :value="
        beneficiarySocioProfessionalCategoryKeys.value(
          occupationIncome.socioProfessionalCategory
        )
      "
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.occupation"
      :value="occupationIncome.occupation"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.employer"
      :value="occupationIncome.employer"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.employerSiret"
      :value="occupationIncome.employerSiret"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.mainIncomeSource"
      :value="mainIncomeSource"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.mainIncomeAmount"
      :value="euros(occupationIncome.mainIncomeAmount)"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.unemploymentNumber"
      :value="occupationIncome.unemploymentNumber"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.cafNumber"
      :value="occupationIncome.cafNumber"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.pensionOrganisations"
      :value="pensionOrganisations"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.bank"
      :value="occupationIncome.bank"
      class="fr-col-6"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.funeralContract"
      :value="occupationIncome.funeralContract"
      class="fr-col-12"
    />
  </div>
  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.partnerMainIncomeSource"
      :value="partnerMainIncomeSource"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.partnerMainIncomeAmount"
      :value="euros(occupationIncome.partnerMainIncomeAmount)"
      class="fr-col-6"
    />
  </div>

  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.majorChildrenMainIncomeSource"
      :value="majorChildrenMainIncomeType"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.majorChildrenMainIncomeAmount"
      :value="euros(occupationIncome.majorChildrenMainIncomeAmount)"
      class="fr-col-6"
    />
  </div>

  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.otherMembersMainIncomeSource"
      :value="otherMembersMainIncomeType"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.otherMembersMainIncomeAmount"
      :value="euros(occupationIncome.otherMembersMainIncomeAmount)"
      class="fr-col-6"
    />
  </div>

  <div class="fr-grid-row">
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereCategorie"
      :value="ministereCategorieKeys.value(occupationIncome.ministereCategorie)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereStructure"
      :value="ministereStructureKeys.value(occupationIncome.ministereStructure)"
      class="fr-col-6"
    />
    <BeneficiaryInfoLabel
      :label="beneficiaryFieldLabels.ministereDepartementServiceAc"
      :value="
        ministereDepartmentServiceAcKeys.value(
          occupationIncome.ministereDepartementServiceAc
        )
      "
      class="fr-col-6"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BeneficiaryPensionOrganisation } from '@prisma/client'
  import {
    beneficiarySocioProfessionalCategoryKeys,
    incomeSourceKeys,
    pensionOrganisationKeys,
    ministereStructureKeys,
    ministereCategorieKeys,
    ministereDepartmentServiceAcKeys
  } from '~/client/options'
  import type { GetBeneficiaryOccupationIncome } from '~/types/beneficiary'
  import { beneficiaryFieldLabels } from '~/client/labels/beneficiary.labels'

  const props = defineProps<{
    occupationIncome: GetBeneficiaryOccupationIncome
  }>()

  const mainIncomeSource = computed(() =>
    arrayToString(
      props.occupationIncome.mainIncomeSource || [],
      incomeSourceKeys.byKey
    )
  )

  const partnerMainIncomeSource = computed(() =>
    arrayToString(
      props.occupationIncome.partnerMainIncomeSource || [],
      incomeSourceKeys.byKey
    )
  )

  const majorChildrenMainIncomeType = computed(() =>
    arrayToString(
      props.occupationIncome.majorChildrenMainIncomeSource || [],
      incomeSourceKeys.byKey
    )
  )

  const otherMembersMainIncomeType = computed(() =>
    arrayToString(
      props.occupationIncome.otherMembersMainIncomeSource || [],
      incomeSourceKeys.byKey
    )
  )

  const pensionOrganisations = computed(() =>
    arrayToString(
      props.occupationIncome.pensionOrganisations?.filter(
        f => f !== BeneficiaryPensionOrganisation.Other
      ) || [],
      pensionOrganisationKeys.byKey
    )
  )

  function arrayToString(arr: string[], options: Record<string, string>) {
    return (arr || []).map(o => options[o] || o).join(', ')
  }
</script>
