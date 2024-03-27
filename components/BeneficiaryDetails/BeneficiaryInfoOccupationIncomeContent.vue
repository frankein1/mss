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
